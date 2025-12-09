# Gift Exchange Frontend

React + Vite frontend for the Gift Exchange API partner matching application.

## Quick Start

### Prerequisites
- Node.js 18+ 
- Gift Exchange API running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Features

✅ **Dynamic Family Form** - Add/remove families and members with validation
✅ **Real-time Validation** - Enforces minimum requirements (3 families, 3 members each, 10 total)
✅ **API Integration** - Seamless connection to Node.js backend
✅ **Match Results** - Clear table showing giver → recipient assignments
✅ **CSV Export** - Download matches as CSV file
✅ **Email Notifications** - Toggle to send emails to family contacts
✅ **Toast Notifications** - Visual feedback for all actions
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Project Structure

```
src/
  ├── components/
  │   ├── FamilyForm/
  │   │   ├── FamilyForm.jsx      # Dynamic family/member input form
  │   │   └── FamilyForm.css      # Form styling
  │   └── MatchResults/
  │       ├── MatchResults.jsx    # Results table and actions
  │       └── MatchResults.css    # Results styling
  ├── hooks/
  │   └── useGiftMatching.js      # Custom hook for API calls
  ├── services/
  │   └── api.js                  # Axios client and API functions
  ├── App.jsx                     # Main app component
  ├── App.css                     # Global styles
  ├── main.jsx                    # Entry point
  └── index.css                   # Global CSS
.env.example                       # Environment variables template
vite.config.js                    # Vite configuration
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

For production, update `VITE_API_URL` to your API server URL.

## API Requirements

The frontend expects the API endpoint to be at:

```
POST /api/match
```

With request format:
```json
{
  "families": [
    {
      "name": "Smith",
      "members": ["John", "Mary", "Tom"],
      "email": "smith@example.com"
    }
  ],
  "sendEmails": true
}
```

## Component Guide

### FamilyForm
Main form component for building families and members.

**Features:**
- Add/remove families
- Add/remove members per family
- Email field per family
- Validation indicators
- Real-time member/family count

### MatchResults
Displays the matched gift assignments.

**Features:**
- Table of all matches (giver → recipient)
- Success indicator with attempt number
- CSV export button
- "Create New Matches" button for another round

### useGiftMatching Hook
Custom hook handling API communication and state management.

**State:**
- `loading` - API request in progress
- `error` - Error message (if any)
- `results` - Array of match results
- `attempts` - Number of attempts used (1-3)

**Methods:**
- `performMatching(families, sendEmails)` - Make API call
- `clearResults()` - Reset to form view

## Styling

The app uses Tailwind CSS concepts with custom CSS. Color scheme:

- **Primary**: Blue (#3b82f6)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)
- **Background**: Light gray (#f9fafb)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development Tips

### Hot Module Reloading
Edit any `.jsx` or `.css` file and changes will reflect instantly.

### Debugging
Open browser DevTools (F12) to see:
- React component tree
- Network requests
- Console logs

### API Testing
Use the `checkHealth()` function to verify API connectivity:
```javascript
import { checkHealth } from './services/api';

checkHealth().then(() => console.log('API OK'));
```

## Performance

- Vite dev server: <100ms HMR
- Production bundle: ~150KB (gzipped)
- Minimal dependencies: React + Axios + React Hot Toast

## Troubleshooting

### "Cannot connect to API server"
- Ensure Node.js backend is running on port 3000
- Check `VITE_API_URL` in `.env` file

### Form won't submit
- Verify all validation requirements are met (3+ families, 3+ members each, 10+ total)
- Check browser console for error details

### Results not displaying
- Check Network tab in DevTools
- Verify API response format matches expected structure
- Check for CORS issues in browser console

## Future Enhancements

- Family history / saved configurations
- Undo/redo functionality
- Different matching strategies
- Integration with calendar for exchange dates
- Statistics dashboard
- User accounts and preferences

## License

MIT
