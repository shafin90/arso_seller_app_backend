const fs = require('fs');

async function fetchDistrictsWithNion() {
  const districtRes = await fetch('https://sohojapi.vercel.app/api/districts');
  const districts = await districtRes.json();

  const result = [];

  for (const district of districts) {
    const districtName = district.name.toLowerCase();
    try {
      const upazilaRes = await fetch(`https://bdapi.editboxpro.com/api/upazilas/${districtName}`);
      const upazilas = await upazilaRes.json();

      result.push({
        id: district.id,
        name: district.name,
        bn_name: district.bn_name,
        seat: 5,
        unions: upazilas.map(upz => ({
          id: upz.id,
          name: upz.name,
          name_bn: upz.name_bn,
        }))
      });
    } catch (error) {
      console.warn(`⚠️ Failed to fetch upazilas for ${district.name}:`, error.message);
    }
  }

  // Save result to JSON file
  fs.writeFileSync('districts_with_unions.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('✅ File saved as districts_with_unions.json');
}

fetchDistrictsWithNion();
