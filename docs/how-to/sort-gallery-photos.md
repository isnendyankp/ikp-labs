# How to Sort Gallery Photos

Learn how to sort photos in the gallery to find exactly what you're looking for.

## What You'll Learn

- How to access the sort dropdown
- Available sorting options
- Combining filters with sorting
- URL-based sorting for sharing

## Prerequisites

- You must be logged in to your account
- At least some photos should exist in the gallery

## Available Sort Options

The gallery provides 4 sorting options to organize your photos:

| Sort Option | Icon | Description | Best For |
|------------|------|-------------|----------|
| **Newest First** 🆕 | Default | Shows most recently uploaded photos first | Viewing latest additions |
| **Oldest First** 📅 | Chronological | Shows oldest photos first | Finding your first uploads |
| **Most Liked** ❤️ | Popularity | Shows photos with highest like count | Discovering popular content |
| **Most Favorited** ⭐ | Favorites | Shows photos with most favorites | Finding highly valued photos |

## Step-by-Step Guide

### 1. Access the Sort Dropdown

1. Navigate to any gallery page:
   - **Main Gallery** (`/gallery`) - All photos
   - **My Photos** (via filter dropdown)
   - **Liked Photos** (`/myprofile/liked-photos`)
   - **Favorited Photos** (`/myprofile/favorited-photos`)

2. Look for the **Sort dropdown** in the header area
   - Located near the top of the page
   - Shows current sort option (e.g., "Newest First 🆕")

### 2. Select a Sort Option

1. **Click** on the sort dropdown button
2. A menu will appear with 4 options
3. **Click** on your desired sort option:
   - **Newest First** - See latest uploads
   - **Oldest First** - Browse chronologically
   - **Most Liked** - Find popular photos
   - **Most Favorited** - Discover favorites

4. The dropdown will close automatically
5. Photos will reload in the new sort order

### 3. Verify Your Selection

After selecting a sort option:
- The dropdown button updates to show your selection
- Photos reload immediately in the new order
- URL updates to include `?sortBy=` parameter
- Page resets to 1 if you were on a different page

## Combining Filters and Sorting

You can combine **filters** and **sorting** for powerful organization:

### Example Combinations

**Scenario 1: Find your most popular uploads**
1. Select filter: **My Photos**
2. Select sort: **Most Liked**
3. Result: Your photos sorted by like count

**Scenario 2: Browse oldest liked photos**
1. Go to **Liked Photos** page
2. Select sort: **Oldest First**
3. Result: Photos you liked, starting with oldest

**Scenario 3: Discover popular public content**
1. Select filter: **Public Photos** (or use default "All Photos")
2. Select sort: **Most Favorited**
3. Result: Public photos sorted by favorites

### Filter + Sort Matrix

All 16 combinations work seamlessly:

| Filter | + Newest | + Oldest | + Most Liked | + Most Favorited |
|--------|----------|----------|--------------|------------------|
| All Photos | ✅ | ✅ | ✅ | ✅ |
| My Photos | ✅ | ✅ | ✅ | ✅ |
| Liked Photos | ✅ | ✅ | ✅ | ✅ |
| Favorited Photos | ✅ | ✅ | ✅ | ✅ |

## Sharing Sorted Views

The sort preference is saved in the URL, making it easy to share specific views:

### Share a Sorted Gallery

1. Select your desired sort option
2. Notice the URL updates (e.g., `/gallery?sortBy=mostLiked`)
3. **Copy the URL** from your browser
4. **Share the link** with others
5. They'll see the gallery with the same sort order

### Example URLs

```
# Most liked photos
https://yourapp.com/gallery?sortBy=mostLiked

# My photos, oldest first
https://yourapp.com/gallery?filter=my-photos&sortBy=oldest

# Liked photos, most favorited
https://yourapp.com/gallery?filter=liked&sortBy=mostFavorited
```

## Tips and Tricks

### 🎯 Quick Access

- **Default sort**: Always "Newest First" if not specified
- **Persistent**: Sort preference stays in URL (bookmark-able)
- **Page refresh**: Your sort selection persists

### ⚡ Performance

- **Fast loading**: Optimized queries load in < 1 second
- **No lag**: Sorting happens instantly
- **Efficient**: Single database query per page

### 🔍 Finding Specific Photos

**Looking for latest additions?**
- Use **Newest First** (default)

**Want to see your photo journey?**
- Filter: **My Photos**
- Sort: **Oldest First**

**Discover trending content?**
- Filter: **All Photos** or **Public Photos**
- Sort: **Most Liked** or **Most Favorited**

**Review photos you appreciated?**
- Page: **Liked Photos**
- Sort: **Newest First** (recent likes) or **Most Liked** (popular among others)

## Troubleshooting

### Sort dropdown not appearing?
- **Solution**: Ensure you're logged in
- **Check**: Page has loaded completely
- **Try**: Refresh the page

### Photos not updating after sort selection?
- **Solution**: Check your internet connection
- **Try**: Refresh the page
- **Check**: Browser console for errors

### URL doesn't include sortBy parameter?
- **Note**: If using default "Newest First", sortBy is optional in URL
- **Verify**: Other sort options should show `?sortBy=` in URL

### Pagination shows wrong page after sorting?
- **Expected behavior**: Page resets to 1 when changing sort
- **Reason**: New sort order means different content per page

## Mobile Usage

On mobile devices:

1. The sort dropdown is **fully responsive**
2. **Tap** the dropdown to open
3. **Tap** your choice to select
4. Dropdown closes automatically

## Accessibility

The sort dropdown supports:
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen readers (ARIA attributes)
- ✅ High contrast mode
- ✅ Focus indicators

## Related Guides

- [Upload Photos](./upload-photos.md) - How to add photos to gallery
- [Like and Favorite Photos](./like-favorite-photos.md) - Interact with photos
- [API Testing](./api-testing.md) - Test sorting via API
- [API Endpoints Reference](../reference/api-endpoints.md) - Technical API documentation

## Next Steps

Now that you know how to sort photos:
1. Experiment with different sort + filter combinations
2. Bookmark your favorite sorted views
3. Share interesting sorted galleries with friends
4. Check photo metadata (likes, favorites, date) to understand sort order

---

**Need Help?** If you encounter issues, check the [troubleshooting section](#troubleshooting) or create an issue on GitHub.
