class CryptoItem {
  constructor(name, symbol, priceUsd, changePercent24Hr) {
    this.name = name;
    this.symbol = symbol;
    this.priceUsd = parseFloat(priceUsd).toFixed(2);
    this.changePercent24Hr = parseFloat(changePercent24Hr).toFixed(2);
  }

  createElement() {
    const itemsList = document.createElement("li");
    itemsList.classList.add("crypto-item", "list-group-item");

    itemsList.innerText = `${this.name} (${this.symbol}) kosztuje ${parseFloat(
      this.priceUsd
    ).toFixed(2)} USD, zmiana ceny w ciągu ostatnich 24 godzin: ${parseFloat(
      this.changePercent24Hr
    ).toFixed(2)}%`;
    itemsList.style.color =
      this.changePercent24Hr > 0
        ? "green"
        : this.changePercent24Hr < 0
        ? "red"
        : "gray";
    return itemsList;
  }
}

const appEl = document.getElementById("app");
const cryptoListEl = document.getElementById("cryptoList");
const refreshBtn = document.getElementById("refreshBtn");
const fetchDate = new Date().toLocaleDateString();
document.getElementById("fetchDate").textContent = fetchDate;
document
  .getElementById("cryptoCount")
  .addEventListener("change", fetchCryptoList);
async function fetchCryptoList() {
  try {
    const loadingEl = document.createElement("h1");
    loadingEl.innerText = "Loading...";
    loadingEl.id = "loader";
    appEl.append(loadingEl);

    const countSelect = document.getElementById("cryptoCount");
    const limit = parseInt(countSelect.value) || 10;

    const response = await fetch(
      "https://rest.coincap.io/v3/assets?apiKey=e0f43d86699aecc6d1eb875e25fd633f4080c51e0cfd9c695cebcf421cdefcc0"
    );
    if (response.status === 429) {
      throw new Error("Za dużo zapytań, spróbuj za chwilę :)");
    }

    const data = await response.json();
    displayCryptoData(data.data, limit);
  } catch (error) {
    console.error("Błąd:", error);
    const errorEl = document.createElement("h1");
    errorEl.innerText = "Coś poszło nie tak :(";
    appEl.appendChild(errorEl);
  } finally {
    const loadingEl = document.getElementById("loader");
    if (loadingEl) loadingEl.remove();
  }
}

function displayCryptoData(cryptoList, limit) {
  cryptoListEl.innerHTML = "";

  const maxItems = Math.min(limit, cryptoList.length);

  for (let i = 0; i < maxItems; i++) {
    const crypto = cryptoList[i];

    const cryptoItem = new CryptoItem(
      crypto.name,
      crypto.symbol,
      crypto.priceUsd,
      crypto.changePercent24Hr
    );

    setTimeout(() => {
      cryptoListEl.appendChild(cryptoItem.createElement());
    }, i * 300);
  }
}
refreshBtn.addEventListener("click", fetchCryptoList);
fetchCryptoList();
