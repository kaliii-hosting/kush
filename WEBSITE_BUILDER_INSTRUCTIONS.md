# Website Builder Instructions

Your website now includes a comprehensive Website Builder in the admin dashboard that allows you to manage content across all pages!

## How to Access the Website Builder

### Enhanced Admin Dashboard (Recommended)
1. Navigate to `/admin/enhanced` in your browser
2. Login with your admin credentials
3. You'll see a sidebar with three options:
   - **Products** - Manage your product inventory
   - **Website Builder** - Edit content for all pages
   - **Homepage Builder** - Specifically for homepage sections

### Direct Access
- Admin Login: `/admin`
- Basic Dashboard: `/admin/dashboard` (products only)
- Enhanced Dashboard: `/admin/enhanced` (full features)

## Website Builder Features

### 1. **Page Management**
The Website Builder allows you to edit content for:
- **Homepage** - Hero section, video banners, etc.
- **About Page** - Mission, values, hero content
- **Shop Page** - Hero content, category descriptions
- **Wholesale Page** - Partner benefits, hero content
- **Contact Page** - Contact information, hero content

### 2. **Content Types You Can Edit**

#### Video Backgrounds
- Upload video URLs for hero sections
- Set overlay opacity
- Add video to any section

#### Titles & Subtitles
- Main headlines for each section
- Descriptive subtitles
- Custom text for CTAs

#### Buttons
- Button text customization
- Link destinations
- Show/hide buttons

#### Images
- Hero background images
- Section images
- Fallback images for videos

### 3. **How to Edit Content**

1. **Select a Page** - Click on the page name in the left sidebar
2. **Expand a Section** - Click on any section to see its current content
3. **Edit Content** - Click "Edit Section" to modify:
   - Video/Image URLs
   - Titles and subtitles
   - Button text and links
   - Descriptions
   - List items (for values, benefits, etc.)
4. **Save Changes** - Click "Save Changes" to update Firebase
5. **See Live Updates** - Changes appear immediately on your website

### 4. **Section Types**

- **Hero Sections** - Large banner areas with video/image backgrounds
- **Text Blocks** - Pure content sections
- **Video Banners** - Video backgrounds with overlay text
- **List Sections** - Values, benefits, features with items
- **CTA Sections** - Call-to-action areas with buttons

### 5. **Managing List Items**

For sections with multiple items (like values or benefits):
1. Click "Add Item" to add new entries
2. Edit each item's title and description
3. Click the trash icon to remove items
4. Changes are saved when you save the section

## Important Notes

### Firebase Integration
- All content is stored in Firebase Realtime Database
- Changes sync immediately across all users
- Content persists between sessions

### Default Content
- The system comes with default content for all pages
- You can reset to defaults using the "Reset All" button
- Be careful - this will overwrite all your customizations!

### Page Updates
The following pages now use dynamic content:
- ✅ About Page - Fully integrated with PageContentContext
- ⏳ Homepage - Uses both Homepage Builder and Website Builder
- ⏳ Shop, Wholesale, Contact - Ready for integration

### Best Practices
1. Always preview your changes on the live site
2. Keep video files optimized for web
3. Use high-quality images as fallbacks
4. Write clear, concise button text
5. Test all button links

## Troubleshooting

### Content Not Updating?
1. Check your Firebase connection
2. Make sure you clicked "Save Changes"
3. Refresh the page to see updates

### Videos Not Playing?
1. Ensure video URLs are accessible
2. Check video format (MP4 recommended)
3. Some browsers block autoplay - test in multiple browsers

### Can't Access Admin?
1. Make sure you're logged in at `/admin`
2. Clear browser cache if needed
3. Check console for any errors

## Next Steps

1. Start with updating your About page content
2. Add video backgrounds to make pages more engaging
3. Customize all text to match your brand voice
4. Test everything on mobile devices

The Website Builder gives you complete control over your site's content without touching any code!