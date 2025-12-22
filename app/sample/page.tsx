import { redirect } from 'next/navigation';

export default function SamplePage() {
    // Redirect to a sample memorial or verify page
    // For now, let's redirect to the create page as we don't have a guaranteed existing sample
    redirect('/create');
}
