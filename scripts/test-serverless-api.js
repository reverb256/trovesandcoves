const API_BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  const sessionId = `test_${Date.now()}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`Testing ${method} ${endpoint}...`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    console.log('---');
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('---');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting Serverless API Tests\n');

  await testEndpoint('/api/categories');

  await testEndpoint('/api/products');
  await testEndpoint('/api/products?featured=true');
  await testEndpoint('/api/products?id=1');

  const cartResult = await testEndpoint('/api/cart', 'POST', {
    productId: 1,
    quantity: 2
  });

  if (cartResult.success) {
    const cartId = cartResult.data.id;
    await testEndpoint('/api/cart');
    await testEndpoint(`/api/cart?id=${cartId}`, 'PUT', { quantity: 3 });
    await testEndpoint(`/api/cart?id=${cartId}`, 'DELETE');
  }

  await testEndpoint('/api/contact', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message from the API test script.'
  });

  await testEndpoint('/api/payments/create-intent', 'POST', {
    amount: 50.00,
    currency: 'cad'
  });

  console.log('🏁 Serverless API Tests Complete!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testEndpoint, runTests };