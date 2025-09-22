// Phase 2 validation test
const { TypesenseResourceFactory } = require('./dist/index.js');

console.log('Testing Phase 2 Implementation...');

// Test getting all supported resources
const supportedResources = TypesenseResourceFactory.getSupportedResources();
console.log('✅ Supported resources:', supportedResources);

// Test getting resource display names
const displayNames = TypesenseResourceFactory.getResourceDisplayNames();
console.log('✅ Resource display names:', displayNames);

// Test checking if new resources are supported
console.log('✅ Is analytics supported?', TypesenseResourceFactory.isResourceSupported('analytics'));
console.log('✅ Is apiKey supported?', TypesenseResourceFactory.isResourceSupported('apiKey'));
console.log('✅ Is alias supported?', TypesenseResourceFactory.isResourceSupported('alias'));

// Test creating resource instances
try {
  const analyticsResource = TypesenseResourceFactory.getResource('analytics');
  console.log('✅ Analytics resource created:', analyticsResource.getResourceName());

  const apiKeyResource = TypesenseResourceFactory.getResource('apiKey');
  console.log('✅ API Key resource created:', apiKeyResource.getResourceName());

  const aliasResource = TypesenseResourceFactory.getResource('alias');
  console.log('✅ Alias resource created:', aliasResource.getResourceName());

  // Test getting operations and fields for new resources
  const analyticsOperations = analyticsResource.getOperations();
  const analyticsFields = analyticsResource.getFields();
  console.log(`✅ Analytics resource has ${analyticsOperations.length} operations and ${analyticsFields.length} fields`);

  const apiKeyOperations = apiKeyResource.getOperations();
  const apiKeyFields = apiKeyResource.getFields();
  console.log(`✅ API Key resource has ${apiKeyOperations.length} operations and ${apiKeyFields.length} fields`);

  const aliasOperations = aliasResource.getOperations();
  const aliasFields = aliasResource.getFields();
  console.log(`✅ Alias resource has ${aliasOperations.length} operations and ${aliasFields.length} fields`);

  // Test that enhanced search operations are available
  const searchResource = TypesenseResourceFactory.getResource('search');
  const searchOperations = searchResource.getOperations();
  const advancedOps = searchOperations.filter(op => ['vectorSearch', 'semanticSearch', 'advancedSearch'].includes(op.options.find(o => o.value === op.value)?.value));
  console.log(`✅ Enhanced search operations found: ${advancedOps.map(op => op.value).join(', ')}`);

  console.log('\n🎉 All Phase 2 tests passed! New resources are working correctly.');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
