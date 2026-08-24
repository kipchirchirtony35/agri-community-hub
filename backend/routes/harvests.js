import express from "express";
import { PrismaClient } from "@prisma/client";
import { normaliseToKg } from "../utils/conversion.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware mockup for authentication simulation
// req.user = { id: 'uuid', role: 'FARMER' | 'OFFICER' | 'ADMIN', county: 'Nairobi' }

router.use(authenticate);

// --- GET /harvests (Scoped by role) ---
router.get('/', async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { county, crop } = req.query;

    let whereClause = {};

    if (role === 'FARMER') {
      whereClause.farmerId = userId;
    } else if (role === 'OFFICER' && county) {
      whereClause.county = county;
    }

    if (crop) whereClause.crop = crop;

    const harvests = await prisma.harvest.findMany({
      where: whereClause,
      include: { farmer: { select: { email: true } } },
      orderBy: { harvestDate: 'desc' }
    });

    res.json({ success: true, count: harvests.length, data: harvests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- POST /harvests ---
router.post('/', async (req, res) => {
  try {
    const { id: farmerId, role } = req.user;
    if (role !== 'FARMER' && role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Unauthorized to log harvests' });
    }

    const { crop, quantity, unit, harvestDate, county, pricePerUnit, quality } = req.body;
    const quantityKg = normaliseToKg(parseFloat(quantity), unit);

    const harvest = await prisma.harvest.create({
      data: {
        farmerId: role === 'ADMIN' && req.body.farmerId ? req.body.farmerId : farmerId,
        crop,
        quantity: parseFloat(quantity),
        unit,
        quantityKg,
        harvestDate: new Date(harvestDate),
        county,
        pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : null,
        quality: quality || 'GRADE_A'
      }
    });

    res.status(201).json({ success: true, data: harvest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// --- GET /harvests/stats (Officer & Admin dashboards) ---
router.get('/stats', async (req, res) => {
  try {
    const { role, county: officerCounty } = req.user;
    if (role === 'FARMER') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const filterCounty = req.query.county || (role === 'OFFICER' ? officerCounty : undefined);
    const where = filterCounty ? { county: filterCounty } : {};

    const harvests = await prisma.harvest.findMany({ where });

    // 1. Overall totals
    const totalQuantityKg = harvests.reduce((acc, h) => acc + h.quantityKg, 0);
    const totalRecords = harvests.length;
    const estimatedTotalValue = harvests.reduce((acc, h) => acc + (h.quantityKg * (h.pricePerUnit || 0)), 0);

    // 2. Totals by Crop
    const cropMap = {};
    harvests.forEach(h => {
      if (!cropMap[h.crop]) cropMap[h.crop] = 0;
      cropMap[h.crop] += h.quantityKg;
    });

    const byCrop = Object.keys(cropMap).map(crop => ({
      crop,
      total_kg: cropMap[crop],
      percentage: totalQuantityKg > 0 ? Number(((cropMap[crop] / totalQuantityKg) * 100).toFixed(2)) : 0
    }));

    // 3. Top Farmers
    const farmerMap = {};
    harvests.forEach(h => {
      farmerMap[h.farmerId] = (farmerMap[h.farmerId] || 0) + h.quantityKg;
    });
    const topFarmers = Object.entries(farmerMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([farmerId, total_kg]) => ({ farmerId, total_kg }));

    // 4. Month-by-month trend
    const monthlyMap = {};
    harvests.forEach(h => {
      const monthStr = h.harvestDate.toISOString().slice(0, 7); // YYYY-MM
      monthlyMap[monthStr] = (monthlyMap[monthStr] || 0) + h.quantityKg;
    });

    const monthlyTrend = Object.keys(monthlyMap)
      .sort()
      .map(month => ({ month, total_kg: monthlyMap[month] }));

    res.json({
      success: true,
      data: {
        overall_totals: { totalQuantityKg, totalRecords, estimatedTotalValue },
        by_crop: byCrop,
        top_farmers: topFarmers,
        monthly_trend: monthlyTrend
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- GET, PATCH, DELETE for individual harvests ---
// (Owner or Admin checks apply here)

export default router;