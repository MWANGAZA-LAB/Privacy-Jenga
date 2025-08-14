"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var adminRoutes_1 = require("./routes/adminRoutes");
var analyticsRoutes_1 = require("./routes/analyticsRoutes");
var contentRoutes_1 = require("./routes/contentRoutes");
var roomRoutes_1 = require("./routes/roomRoutes");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', function (req, res) {
    res.status(200).json({
        status: 'healthy',
        service: 'Privacy Jenga API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/content', contentRoutes_1.default);
app.use('/api/rooms', roomRoutes_1.default);
// 404 handler
app.use('*', function (req, res) {
    res.status(404).json({
        error: 'Not Found',
        message: "Route ".concat(req.originalUrl, " not found"),
        availableRoutes: [
            '/health',
            '/api/admin',
            '/api/analytics',
            '/api/content',
            '/api/rooms'
        ]
    });
});
// Error handler
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// Start server
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Privacy Jenga API running on port ".concat(PORT));
    console.log("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/health"));
    console.log("\uD83D\uDD27 Environment: ".concat(process.env.NODE_ENV || 'development'));
});
exports.default = app;
