const routes = {
  auth: {
    "auth/login": ["POST"],
    "auth/signup": ["POST"],
    "auth/verify": ["GET"],
  },
  business: {
    "business/profile": ["GET", "PUT"],
    "business/promotions": ["GET", "POST", "PUT", "DELETE"],
    "business/statistics": ["GET"],
    "business/visits": ["GET", "POST"],
  },
  client: {
    "client/setup-profile": ["POST"],
    "client/profile": ["GET", "PUT"],
    "client/visits": ["GET", "POST"],
    "client/cards": ["GET"],
    "client/promotions": ["GET"],
  },
  nexo: {
    "nexo/register": ["POST"],
    "nexo/validate": ["POST"],
  },
};

export default routes;
