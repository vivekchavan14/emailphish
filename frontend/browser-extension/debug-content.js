// Debug version - Simple test to see if extension works
console.log("🔧 PhishMail Guard Debug Script Loaded!");

// Show alert when script runs
alert("PhishMail Guard extension is running on this page!");

// Add a visible test element to the page
setTimeout(() => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div style="
      position: fixed; 
      top: 10px; 
      right: 10px; 
      background: red; 
      color: white; 
      padding: 10px; 
      border-radius: 5px; 
      z-index: 999999;
      font-family: Arial;
    ">
      🔧 PhishMail Guard Test - Extension is Working!
      <br>Current page: ${window.location.hostname}
    </div>
  `;
  document.body.appendChild(testDiv);
  
  console.log("🔧 Test element added to page");
  console.log("🔧 Current URL:", window.location.href);
  console.log("🔧 Page title:", document.title);
}, 1000);