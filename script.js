const images = {
  bau: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqd5ke5clln6f7",
  cua: "https://img.pikbest.com/origin/10/13/57/77YpIkbEsT8Ar.jpg!w700wp",
  tom: "https://haisanbaba.com/wp-content/uploads/tom-1564206655-5711-1564206932.png",
  ca: "https://img.pikbest.com/origin/10/13/03/87ZpIkbEsTsKn.jpg!w700wp",
  nai: "https://img.pikbest.com/origin/09/10/59/40IpIkbEsT98a.jpg!w700wp",
  ga: "https://mekoong.com/wp-content/uploads/2022/11/7151752393896643867-21.jpg"
};

const fallbackImage = "https://via.placeholder.com/100x100?text=Image+Error";

const keys = Object.keys(images);
const translate = {
  bau: "Bầu",
  cua: "Cua",
  tom: "Tôm",
  ca: "Cá",
  nai: "Nai",
  ga: "Gà"
};

function rollDice(bets) {
  const button = document.querySelector("button");
  button.disabled = true;
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  const dice3 = document.getElementById("dice3");
  const diceElements = [dice1, dice2, dice3];
  diceElements.forEach(dice => dice.classList.add("rolling"));

  // Chọn kết quả ngẫu nhiên nhưng chưa hiển thị ngay
  const results = [];
  diceElements.forEach(() => {
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    results.push(randKey);
  });

  // Hiển thị kết quả sau 1.5 giây
  setTimeout(() => {
    diceElements.forEach((dice, index) => {
      const randKey = results[index];
      const img = new Image();
      img.src = images[randKey];
      img.onload = () => {
        dice.style.backgroundImage = `url('${img.src}')`;
        dice.setAttribute("aria-label", `Xúc xắc ${index + 1}: ${translate[randKey]}`);
      };
      img.onerror = () => {
        dice.style.backgroundImage = `url('${fallbackImage}')`;
        dice.setAttribute("aria-label", `Xúc xắc ${index + 1}: Lỗi tải hình`);
      };
    });

    const readable = results.map(r => translate[r]).join(" - ");
    const resultElement = document.getElementById("result");
    resultElement.textContent = "Kết quả: " + readable;

    diceElements.forEach(dice => dice.classList.remove("rolling"));
    button.disabled = false;

  }, 1500);
}

socket.on('gameResult', (data) => {
  const { results, winnings, newBalance } = data;

  const diceElements = [
    document.getElementById("dice1"),
    document.getElementById("dice2"),
    document.getElementById("dice3")
  ];

  diceElements.forEach((dice, index) => {
    const randKey = results[index];
    const img = new Image();
    img.src = images[randKey];
    img.onload = () => {
      dice.style.backgroundImage = `url('${img.src}')`;
      dice.setAttribute("aria-label", `Xúc xắc ${index + 1}: ${translate[randKey]}`);
    };
    img.onerror = () => {
      dice.style.backgroundImage = `url('${fallbackImage}')`;
      dice.setAttribute("aria-label", `Xúc xắc ${index + 1}: Lỗi tải hình`);
    };
    dice.classList.remove("rolling");
  });

  const readable = results.map(r => translate[r]).join(" - ");
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Kết quả: " + readable;

  updateBalance(newBalance);
  document.querySelector("button").disabled = false;
});

let balance = 1000;

function placeBets() {
  const bauBet = parseInt(document.getElementById("bau-bet").value) || 0;
  const cuaBet = parseInt(document.getElementById("cua-bet").value) || 0;
  const tomBet = parseInt(document.getElementById("tom-bet").value) || 0;
  const caBet = parseInt(document.getElementById("ca-bet").value) || 0;
  const naiBet = parseInt(document.getElementById("nai-bet").value) || 0;
  const gaBet = parseInt(document.getElementById("ga-bet").value) || 0;

  const totalBet = bauBet + cuaBet + tomBet + caBet + naiBet + gaBet;

  if (totalBet > balance) {
    alert("Bạn không có đủ tiền để đặt cược!");
    return;
  }

  const bets = {
    bau: bauBet,
    cua: cuaBet,
    tom: tomBet,
    ca: caBet,
    nai: naiBet,
    ga: gaBet
  };

  socket.emit('placeBet', bets);
}

function calculateResult(results, bets) {
  let winnings = 0;

  results.forEach(result => {
    if (bets[result]) {
      winnings += bets[result];
    }
  });
  
  socket.on('balanceUpdate', (newBalance) => {
    updateBalance(newBalance);
  });

  return winnings;
}

function updateBalance(amount) {
  balance += amount;
  document.getElementById("balance").textContent = "Số dư: " + balance;
}

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});