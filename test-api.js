async function test() {
    try {
        console.log('Testing GET /api/hello...');
        const resHello = await fetch('http://localhost:3000/api/hello');
        console.log('Hello Status:', resHello.status);
        if (resHello.ok) console.log('Hello Body:', await resHello.json());

        console.log('Testing POST /api/memorials...');
        const res = await fetch('http://localhost:3000/api/memorials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Satoshi Test',
                birthDate: '2009-01-03',
                deathDate: 'Forever',
                epitaph: 'Vires in Numeris'
            })
        });
        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            console.log('Response:', data);
        } else {
            const text = await res.text();
            console.log('Error Body:', text.substring(0, 500));
        }
    } catch (e) {
        console.error('Test Failed:', e);
    }
}
test();
