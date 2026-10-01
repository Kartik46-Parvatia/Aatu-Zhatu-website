const products = [
  {id:1,name:"Smart Watch",price:499,category:"tech",icon:"⌚",desc:"Modern smartwatch for your everyday routine."},
  {id:2,name:"Wireless Headphones",price:899,category:"tech",icon:"🎧",desc:"Clear sound with a comfortable wireless design."},
  {id:3,name:"Running Shoes",price:799,category:"fashion",icon:"👟",desc:"Lightweight and comfortable shoes for daily use."},
  {id:4,name:"Classic Backpack",price:649,category:"fashion",icon:"🎒",desc:"A stylish backpack for college and travel."},
  {id:5,name:"Desk Lamp",price:399,category:"home",icon:"💡",desc:"Minimal desk lamp for work and study."},
  {id:6,name:"Coffee Mug",price:249,category:"home",icon:"☕",desc:"Simple ceramic mug for your morning coffee."}
];

function getCart(){ return JSON.parse(localStorage.getItem("az_cart") || "[]"); }
function saveCart(cart){ localStorage.setItem("az_cart", JSON.stringify(cart)); }

function updateCartCount(){
  const count = getCart().reduce((sum,item)=>sum + item.qty,0);
  const el = document.getElementById("cartCount");
  if(el) el.textContent = count;
}

function addToCart(id){
  const cart = getCart();
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(cart);
  updateCartCount();
  alert("Product added to cart!");
}

function renderProducts(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = list.map(p=>`
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <b>₹${p.price.toLocaleString("en-IN")}</b>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterProducts(category, button){
  document.querySelectorAll(".filter button").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  renderProducts("catalog", category==="all" ? products : products.filter(p=>p.category===category));
}

function renderCart(){
  updateCartCount();
  const container = document.getElementById("cartList");
  const cart = getCart();

  if(!cart.length){
    container.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Add some products from the Products page.</p><a href="content.html">Browse Products →</a></div>`;
    updateSummary(0);
    return;
  }

  container.innerHTML = cart.map(item=>{
    const p = products.find(x=>x.id===item.id);
    return `<article class="cart-item">
      <div class="cart-icon">${p.icon}</div>
      <div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <b>₹${p.price.toLocaleString("en-IN")}</b>
      </div>
      <div class="actions">
        <div class="qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
        <button class="remove" onclick="removeFromCart(${p.id})">Remove</button>
      </div>
    </article>`;
  }).join("");

  updateSummary(cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id);
    return sum+p.price*item.qty;
  },0));
}

function changeQty(id,change){
  const cart=getCart();
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=change;
  if(item.qty<=0) cart.splice(cart.indexOf(item),1);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  saveCart(getCart().filter(item=>item.id!==id));
  renderCart();
}

function updateSummary(total){
  ["subtotal","total"].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.textContent="₹"+total.toLocaleString("en-IN");
  });
}

function renderPayment(){
  updateCartCount();
  const cart=getCart();
  const box=document.getElementById("paymentItems");
  let total=0;

  if(!cart.length){
    box.innerHTML="<p>Your cart is empty. <a href='content.html'>Shop now</a></p>";
  } else {
    box.innerHTML=cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      total+=p.price*item.qty;
      return `<div class="order-line"><span>${p.icon} ${p.name} × ${item.qty}</span><span>₹${(p.price*item.qty).toLocaleString("en-IN")}</span></div>`;
    }).join("");
  }

  document.getElementById("paymentTotal").textContent="₹"+total.toLocaleString("en-IN");
  document.getElementById("payAmount").textContent="₹"+total.toLocaleString("en-IN");
}
