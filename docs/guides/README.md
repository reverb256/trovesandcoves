# User Guides

## 📖 Overview

This section contains guides for end users, administrators, and troubleshooting common issues.

## 📚 Available Guides

### For End Users
- [**Getting Started**](#getting-started) - Basic usage and navigation
- [**Shopping Guide**](#shopping-guide) - How to browse and purchase products
- [**Account Management**](#account-management) - Managing your account and orders

### For Administrators
- [**Content Management**](#content-management) - Managing products and content
- [**Analytics**](#analytics) - Understanding site analytics
- [**Configuration**](#configuration) - System configuration options

### Technical Support
- [**Troubleshooting**](troubleshooting.md) - Common issues and solutions
- [**FAQ**](#frequently-asked-questions) - Frequently asked questions
- [**Contact Support**](#contact-support) - How to get help

## 🚀 Getting Started

### First Visit
1. **Browse Products**: Explore our collection of mystical crystal jewelry
2. **Search & Filter**: Use the search bar to find specific items
3. **Product Details**: Click on any product for detailed information
4. **Add to Cart**: Select items and add them to your shopping cart

### Navigation
- **Home**: Featured products and latest collections
- **Products**: Full product catalog with filtering
- **About**: Learn about our story and craftsmanship
- **Contact**: Get in touch with our team

## 🛒 Shopping Guide

### Browsing Products
- **Categories**: Filter by jewelry type (pendants, necklaces, bracelets)
- **Features**: Toggle between featured and all products
- **Search**: Use keywords to find specific crystals or styles
- **Images**: Click product images for detailed views

### Product Information
Each product page includes:
- **High-quality images**: Multiple angles and detail shots
- **Descriptions**: Detailed information about materials and metaphysical properties
- **Pricing**: Clear pricing in Canadian dollars
- **Availability**: Real-time stock status
- **Care Instructions**: How to maintain your jewelry

### Shopping Cart
- **Add Items**: Click "Add to Cart" on product pages
- **Quantity**: Adjust quantities in the cart
- **Session Storage**: Cart persists for 24 hours
- **Checkout**: Secure payment processing (coming soon)

## 👤 Account Management

### Creating an Account
Currently, the platform operates with session-based cart management. Full account features are coming soon.

### Order History
Order tracking and history features will be available with the full account system.

## 🔧 Content Management

### Product Updates
Products are managed through the Cloudflare KV storage system. Updates can be made through:
- Direct KV namespace editing
- API endpoints for bulk updates
- Automated imports from external sources

### Adding New Products
New products can be added via:
1. API endpoint: `POST /api/admin/products`
2. Bulk import scripts in `scripts/` directory
3. Manual KV updates through Cloudflare dashboard

## 📊 Analytics

### Available Metrics
- **Page Views**: Track visitor engagement
- **Product Views**: Monitor product popularity
- **Cart Activities**: Understand shopping behavior
- **Search Queries**: Optimize content based on searches

### Accessing Analytics
Analytics data is stored in Cloudflare KV and can be accessed through:
- Cloudflare Analytics dashboard
- Custom analytics endpoints
- Exported data reports

## ⚙️ Configuration

### Environment Variables
Key configuration options in `.env`:
```env
VITE_API_URL=your-api-endpoint
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
```

### Feature Flags
Toggle features on/off:
- AI recommendations
- Analytics tracking
- Cart functionality
- Search capabilities

## 💡 Frequently Asked Questions

### General Questions

**Q: Is the site secure for shopping?**
A: Yes, the site uses enterprise-grade security including HTTPS, CORS protection, and secure session management.

**Q: Do you ship internationally?**
A: Currently focused on the Canadian market, with plans for international expansion.

**Q: What payment methods do you accept?**
A: Secure payment processing is being integrated. Currently redirects to trusted external checkout.

### Technical Questions

**Q: Why does the site sometimes redirect to a different URL?**
A: The site uses a hybrid architecture. If the API reaches its daily limit, it gracefully falls back to a static version.

**Q: Is my cart information saved?**
A: Yes, cart information is saved for 24 hours using secure session storage.

**Q: Can I browse offline?**
A: The site includes offline capabilities through service workers for browsing cached content.

### Product Questions

**Q: Are the crystals authentic?**
A: Yes, all crystals are ethically sourced and authentic, with detailed provenance information.

**Q: Do you provide care instructions?**
A: Yes, each product includes specific care instructions for maintaining your jewelry.

**Q: Can I request custom pieces?**
A: Custom orders can be discussed through our contact form.

## 📞 Contact Support

### Getting Help

For technical issues:
1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Search existing issues on GitHub
3. Create a new issue with detailed information

For general support:
- **Email**: support@trovesandcoves.ca
- **Response Time**: Within 24 hours
- **Business Hours**: Monday-Friday, 9 AM - 5 PM MST

### Reporting Issues

When reporting issues, please include:
- Browser type and version
- Operating system
- Steps to reproduce the issue
- Any error messages
- Screenshots if applicable

### Feature Requests

Feature requests are welcome! Please:
1. Check existing requests on GitHub
2. Create a detailed issue describing the feature
3. Include use cases and benefits
4. Be patient - we review all requests

---

Need immediate help? Check our [Troubleshooting Guide](troubleshooting.md) for quick solutions.
