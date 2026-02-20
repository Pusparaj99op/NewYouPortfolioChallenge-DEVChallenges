import { Link } from 'react-router-dom'
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui'

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Page not found</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/70">The page you’re looking for doesn’t exist.</p>
        <Link to="/">
          <Button variant="secondary">Back to overview</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
