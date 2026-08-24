const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- GET /officers (Public directory with filters) ---
router.get('/', async (req, res) => {
  try {
    const { county, specialisation } = req.query;
    let whereClause = { isActive: true }; // Soft delete filter by default

    if (county) whereClause.county = county;
    if (specialisation) whereClause.specialisation = specialisation;

    const officers = await prisma.officer.findMany({
      where: whereClause,
      select: { id: true, fullName: true, county: true, specialisation: true, phoneNumber: true, email: true }
    });

    res.json({ success: true, count: officers.length, data: officers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- POST /officers (Admin Only) ---
router.post('/', async (req, res) => {
  try {
    // Check if req.user.role === 'ADMIN'
    const { userId, fullName, email, phoneNumber, county, specialisation } = req.body;

    const officer = await prisma.officer.create({
      data: { userId, fullName, email, phoneNumber, county, specialisation, isActive: true }
    });

    res.status(201).json({ success: true, data: officer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// --- DELETE /officers/{id} (Soft Delete by Default) ---
router.delete('/:id', async (req, res) => {
  try {
    // Check if req.user.role === 'ADMIN'
    const { id } = req.params;

    const updatedOfficer = await prisma.officer.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Officer deactivated successfully', data: updatedOfficer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;