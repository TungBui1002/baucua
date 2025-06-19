import { useState, useEffect } from "react";
import { toast } from "sonner";
import { setCookie, getCookie } from "./utils/cookies";
import { ContactModal } from "./components/ContactModal";

type Animal = "bau" | "cua" | "tom" | "ca" | "ga" | "nai";

interface AnimalInfo {
  name: string;
  emoji: string;
  color: string;
}

const animals: Record<Animal, AnimalInfo> = {
  bau: { name: "Bầu", emoji: "🎃", color: "bg-orange-500" },
  cua: { name: "Cua", emoji: "🦀", color: "bg-red-500" },
  tom: { name: "Tôm", emoji: "🦐", color: "bg-pink-500" },
  ca: { name: "Cá", emoji: "🐟", color: "bg-blue-500" },
  ga: { name: "Gà", emoji: "🐓", color: "bg-yellow-500" },
  nai: { name: "Nai", emoji: "🦌", color: "bg-green-500" },
};

export function BauCuaGame() {
  const [money, setMoney] = useState(1000);
  const [bets, setBets] = useState<Record<Animal, number>>({
    bau: 0,
    cua: 0,
    tom: 0,
    ca: 0,
    ga: 0,
    nai: 0,
  });
  const [diceResults, setDiceResults] = useState<Animal[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState<Array<{
    diceResults: Animal[];
    winnings: number;
    totalBet: number;
  }>>([]);
  const [showContactModal, setShowContactModal] = useState(false);

  // Load money from cookie on component mount
  useEffect(() => {
    const savedMoney = getCookie("bauCuaMoney");
    if (savedMoney) {
      setMoney(parseInt(savedMoney, 10));
    }
  }, []);

  // Save money to cookie whenever it changes
  useEffect(() => {
    setCookie("bauCuaMoney", money.toString());
    
    // Show contact modal if money is 0 and no bets are placed
    if (money === 0 && totalBet === 0 && !isRolling) {
      setShowContactModal(true);
    }
  }, [money]);

  const totalBet = Object.values(bets).reduce((sum, bet) => sum + bet, 0);

  const placeBet = (animal: Animal, amount: number) => {
    if (money >= amount && !isRolling) {
      setBets(prev => ({
        ...prev,
        [animal]: prev[animal] + amount
      }));
      setMoney(prev => prev - amount);
    } else if (money < amount) {
      if (money === 0) {
        setShowContactModal(true);
      } else {
        toast.error("Không đủ tiền để đặt cược!");
      }
    }
  };

  const clearBets = () => {
    if (!isRolling) {
      setMoney(prev => prev + totalBet);
      setBets({
        bau: 0,
        cua: 0,
        tom: 0,
        ca: 0,
        ga: 0,
        nai: 0,
      });
    }
  };

  const rollDice = () => {
    if (totalBet === 0) {
      toast.error("Hãy đặt cược trước khi lắc!");
      return;
    }

    setIsRolling(true);
    
    // Animation effect
    const rollAnimation = setInterval(() => {
      const randomResults: Animal[] = [];
      for (let i = 0; i < 3; i++) {
        const animalKeys = Object.keys(animals) as Animal[];
        randomResults.push(animalKeys[Math.floor(Math.random() * animalKeys.length)]);
      }
      setDiceResults(randomResults);
    }, 100);

    // Final result after 2 seconds
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      const finalResults: Animal[] = [];
      for (let i = 0; i < 3; i++) {
        const animalKeys = Object.keys(animals) as Animal[];
        finalResults.push(animalKeys[Math.floor(Math.random() * animalKeys.length)]);
      }
      
      setDiceResults(finalResults);
      calculateWinnings(finalResults);
      setIsRolling(false);
    }, 2000);
  };

  const calculateWinnings = (results: Animal[]) => {
    let totalWinnings = 0;
    
    Object.entries(bets).forEach(([animal, betAmount]) => {
      if (betAmount > 0) {
        const matches = results.filter(result => result === animal).length;
        if (matches > 0) {
          const winAmount = betAmount * (matches + 1); // 1:1 + original bet
          totalWinnings += winAmount;
        }
      }
    });

    setMoney(prev => prev + totalWinnings);
    
    // Add to history
    setGameHistory(prev => [{
      diceResults: results,
      winnings: totalWinnings,
      totalBet
    }, ...prev.slice(0, 9)]); // Keep last 10 games

    // Clear bets
    setBets({
      bau: 0,
      cua: 0,
      tom: 0,
      ca: 0,
      ga: 0,
      nai: 0,
    });

    // Show result
    if (totalWinnings > totalBet) {
      toast.success(`Chúc mừng! Bạn thắng ${totalWinnings - totalBet} xu!`);
    } else if (totalWinnings > 0) {
      toast.info(`Hòa! Bạn nhận lại ${totalWinnings} xu!`);
    } else {
      toast.error(`Thua rồi! Mất ${totalBet} xu!`);
    }
  };

  const resetGame = () => {
    setMoney(1000);
    setBets({
      bau: 0,
      cua: 0,
      tom: 0,
      ca: 0,
      ga: 0,
      nai: 0,
    });
    setDiceResults([]);
    setGameHistory([]);
    setCookie("bauCuaMoney", "1000");
  };

  const addMoney = (amount: number) => {
    setMoney(prev => prev + amount);
    toast.success(`Đã nạp thêm ${amount.toLocaleString()} xu!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-300 mb-2">🎲 Bầu Cua Tôm Cá 🎲</h1>
        <div className="flex justify-center items-center gap-4 text-yellow-100 flex-wrap">
          <div className="bg-red-800/50 px-4 py-2 rounded-lg border border-yellow-600">
            💰 Tiền: <span className="font-bold text-yellow-300">{money.toLocaleString()} xu</span>
          </div>
          <div className="bg-red-800/50 px-4 py-2 rounded-lg border border-yellow-600">
            🎯 Đã cược: <span className="font-bold text-yellow-300">{totalBet.toLocaleString()} xu</span>
          </div>
          {money === 0 && (
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg border border-yellow-600 font-bold text-white animate-pulse"
            >
              💸 Nạp Tiền
            </button>
          )}
        </div>
      </div>

      {/* Low Money Warning */}
      {money > 0 && money < 100 && (
        <div className="bg-orange-600/20 border-2 border-orange-500 rounded-xl p-4 text-center">
          <div className="text-orange-300 font-bold text-lg mb-2">⚠️ Sắp Hết Tiền!</div>
          <div className="text-orange-100 mb-3">
            Bạn chỉ còn {money} xu. Hãy liên hệ anh Tùng để nạp thêm tiền!
          </div>
          <button
            onClick={() => setShowContactModal(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500"
          >
            📞 Liên Hệ Nạp Tiền
          </button>
        </div>
      )}

      {/* Dice Results */}
      <div className="bg-red-800/30 rounded-xl p-6 border-2 border-yellow-600">
        <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">Kết Quả Xúc Xắc</h2>
        <div className="flex justify-center gap-4">
          {diceResults.length > 0 ? (
            diceResults.map((result, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl border-2 border-yellow-600 ${
                  isRolling ? 'animate-bounce' : animals[result].color
                }`}
              >
                {animals[result].emoji}
              </div>
            ))
          ) : (
            <div className="text-yellow-100 text-lg">Chưa lắc xúc xắc</div>
          )}
        </div>
      </div>

      {/* Betting Board */}
      <div className="bg-red-800/30 rounded-xl p-6 border-2 border-yellow-600">
        <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">Bàn Cược</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(animals).map(([key, animal]) => (
            <div key={key} className="bg-red-900/50 rounded-lg p-4 border border-yellow-600">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{animal.emoji}</div>
                <div className="text-yellow-300 font-bold">{animal.name}</div>
                <div className="text-yellow-100">
                  Đã cược: <span className="font-bold">{bets[key as Animal]} xu</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => placeBet(key as Animal, 10)}
                  disabled={isRolling || money < 10}
                  className="px-3 py-1 bg-yellow-600 text-red-900 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +10
                </button>
                <button
                  onClick={() => placeBet(key as Animal, 50)}
                  disabled={isRolling || money < 50}
                  className="px-3 py-1 bg-yellow-600 text-red-900 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +50
                </button>
                <button
                  onClick={() => placeBet(key as Animal, 100)}
                  disabled={isRolling || money < 100}
                  className="px-3 py-1 bg-yellow-600 text-red-900 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +100
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={rollDice}
          disabled={isRolling || totalBet === 0}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRolling ? "Đang lắc..." : "🎲 Lắc Xúc Xắc"}
        </button>
        <button
          onClick={clearBets}
          disabled={isRolling || totalBet === 0}
          className="px-8 py-3 bg-orange-600 text-white rounded-lg font-bold text-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🗑️ Xóa Cược
        </button>
        <button
          onClick={resetGame}
          disabled={isRolling}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Chơi Lại
        </button>
      </div>

      {/* Admin Controls (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800/30 rounded-xl p-4 border-2 border-gray-600">
          <h3 className="text-lg font-bold text-gray-300 text-center mb-3">🔧 Admin (Dev Only)</h3>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => addMoney(100)}
              className="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-500"
            >
              +100 xu
            </button>
            <button
              onClick={() => addMoney(500)}
              className="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-500"
            >
              +500 xu
            </button>
            <button
              onClick={() => addMoney(1000)}
              className="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-500"
            >
              +1000 xu
            </button>
          </div>
        </div>
      )}

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div className="bg-red-800/30 rounded-xl p-6 border-2 border-yellow-600">
          <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">Lịch Sử Chơi</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {gameHistory.map((game, index) => (
              <div key={index} className="bg-red-900/50 rounded-lg p-3 border border-yellow-600">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {game.diceResults.map((result, i) => (
                      <span key={i} className="text-2xl">{animals[result].emoji}</span>
                    ))}
                  </div>
                  <div className="text-yellow-100">
                    Cược: {game.totalBet} xu | 
                    <span className={game.winnings > game.totalBet ? "text-green-400" : game.winnings > 0 ? "text-yellow-400" : "text-red-400"}>
                      {game.winnings > game.totalBet ? " Thắng" : game.winnings > 0 ? " Hòa" : " Thua"} {game.winnings - game.totalBet} xu
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="bg-red-800/30 rounded-xl p-6 border-2 border-yellow-600">
        <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">Luật Chơi</h2>
        <div className="text-yellow-100 space-y-2">
          <p>• Đặt cược vào các con vật: Bầu 🎃, Cua 🦀, Tôm 🦐, Cá 🐟, Gà 🐓, Nai 🦌</p>
          <p>• Lắc 3 xúc xắc, mỗi xúc xắc có 6 mặt tương ứng với 6 con vật</p>
          <p>• Nếu con vật bạn cược xuất hiện:</p>
          <p className="ml-4">- 1 lần: Thắng 1 lần tiền cược</p>
          <p className="ml-4">- 2 lần: Thắng 2 lần tiền cược</p>
          <p className="ml-4">- 3 lần: Thắng 3 lần tiền cược</p>
          <p>• Nếu không xuất hiện: Mất tiền cược</p>
          <p className="text-orange-300 font-bold">• Hết tiền? Liên hệ anh Tùng để nạp thêm!</p>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
}
