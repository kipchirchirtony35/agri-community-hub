# Contributors

## Team Members

| Name | GitHub | Role | Contributions |
|------|--------|------|---------------|
| Kipchirchir Tony | [Kipchirchirtony35](https://github.com/kipchirchirtony35) | Team Lead | Setup, Header component, API integration |
| Ignitaus John | [mrignatio7](https://github.com/mrignatio7) | Developer | Post model + GET/POST /posts Inquiry model + GET/POST /inquiries PATCH /inquiries/:id for officer replies/status  |
| Gladwell Muthoni| [@gladwellmuthoni](https://github.com/gladwellmuthoni) | Harvests & OfficersOwns harvest record-keeping and the officer directory, including simple stats for dashboards.  |
| Okolla Immaculate | [okolla-immaculate](https://github.com/okolla-immaculate) |
| Philip Biven | [Philipbiven-pixel](https://github.com/philipbiven-pixel) | Developer | — Auth & UsersOwns the User model, JWT-based login/register, and role middleware (admin/officer/member). This unblocks everyone else, so start it first. Build User schema + bcrypt password hashing POST /auth/register, /auth/login, JWT issuing Role-check middleware for protected routes |

## Contribution Breakdown

### Kipchirchir Tony
- Set up project structure
- Created header componentCompress-Archive -Path * -DestinationPath ..\agri-community-hub.zip

- Implemented API calls
- Code review for all PRs

### Team Member 2
- Built footer component
- Styled all forms
- Added responsive design
- Wrote documentation

### Gladwell Muthoni
- Harvest model + GET/POST /harvests 
- GET /harvests/stats (totals by crop, by farmer) 
- Officer model + CRUD for /officers 

### Okolla Immaculate
- Weather, Integration
- Proxy a real weather API (OpenWeatherMap) via GET /weather Set up Express app, CORS, env config, error handling 

### Philip Biven
- Build User schema + bcrypt password hashing
- POST /auth/register, /auth/login, JWT issuing 
- Role-check middleware for protected routes 

### Ignitaus John 
- Post model + GET/POST /posts
- Inquiry model + GET/POST /inquiries
- PATCH /inquiries/:id for officer replies/status

