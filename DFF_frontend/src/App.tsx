import { Routes, Route, Navigate } from 'react-router-dom'

// Screens — implement these using the Figma design
// import Feed from './screens/Feed'
// import Login from './screens/Login'
// import Preferences from './screens/Preferences'

export default function App() {
  return (
    <Routes>
      {/* Placeholder routes — replace with actual screen components */}
      <Route path="/" element={<div className="p-4 text-xl font-bold">Feed — coming soon</div>} />
      <Route path="/login" element={<div className="p-4 text-xl font-bold">Login — coming soon</div>} />
      <Route path="/preferences" element={<div className="p-4 text-xl font-bold">Preferences — coming soon</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
