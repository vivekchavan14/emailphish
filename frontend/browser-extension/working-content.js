// Minimal working version
console.log("🟢 PhishMail Guard MINIMAL version loaded!");

setTimeout(() => {
  console.log("🟢 Starting email detection...");
  
  // Simple email detection for Gmail
  const emails = document.querySelectorAll('[data-message-id], .ii.gt .a3s.aiL');
  console.log("🟢 Found", emails.length, "email elements");
  
  emails.forEach((email, index) => {
    console.log("🟢 Processing email", index + 1);
    
    // Add a simple test badge
    const badge = document.createElement('div');
    badge.innerHTML = '🔍 TEST WORKING';
    badge.style.cssText = 'background: lime; color: black; padding: 5px; margin: 5px; font-weight: bold;';
    
    if (email.parentElement) {
      email.parentElement.insertBefore(badge, email);
    }
  });
}, 3000);