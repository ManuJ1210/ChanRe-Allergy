// Bulk Update Specializations Utility
// Run this in browser console to add specializations to existing doctors

const bulkUpdateSpecializations = async () => {
  const API_BASE = 'http://localhost:5000/api';
  
  // Sample specializations for different doctors
  const doctorUpdates = [
    {
      id: 'DOCTOR_ID_1', // Replace with actual doctor ID
      specializations: ['Cardiology', 'Internal Medicine']
    },
    {
      id: 'DOCTOR_ID_2', // Replace with actual doctor ID  
      specializations: ['Pediatrics', 'General Medicine']
    }
  ];

  // Get auth token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No auth token found. Please login first.');
    return;
  }

  console.log('🚀 Starting bulk update of specializations...');

  for (const update of doctorUpdates) {
    try {
      console.log(`📝 Updating doctor ${update.id}...`);
      
      const response = await fetch(`${API_BASE}/superadmin/doctors/${update.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specializations: update.specializations
        })
      });

      if (response.ok) {
        console.log(`✅ Updated doctor ${update.id} with specializations:`, update.specializations);
      } else {
        console.error(`❌ Failed to update doctor ${update.id}:`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error updating doctor ${update.id}:`, error);
    }
  }

  console.log('🎉 Bulk update completed! Refresh the page to see changes.');
};

// Instructions for use:
console.log(`
🔧 BULK SPECIALIZATIONS UPDATE UTILITY

To use this utility:
1. Get the doctor IDs from the current page
2. Modify the doctorUpdates array above with actual IDs and desired specializations
3. Run: bulkUpdateSpecializations()

Example specializations:
- Cardiology
- Internal Medicine  
- Pediatrics
- Dermatology
- Neurology
- Orthopedics
- Allergy & Immunology
- General Medicine

Current doctors visible:
${document.querySelectorAll('tbody tr').length} doctors found on page
`);

// Export function to window for easy access
window.bulkUpdateSpecializations = bulkUpdateSpecializations;
