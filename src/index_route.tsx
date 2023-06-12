import "./App.css";
import { Button } from '@mui/joy';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <main>
        Welcome to the Physics Quiz.
        <br />
        Choose a problem type:
        <div className="homepage-buttons">
            <Button component={Link} to="/rhr">Right Hand Rule</Button>
        </div>

    </main>
  );
}
