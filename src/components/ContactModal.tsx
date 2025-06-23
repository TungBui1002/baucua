import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-red-900 rounded-xl p-6 border-2 border-yellow-600 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">💰 Hết Tiền Rồi!</h2>
          <p className="text-yellow-100">
            Bạn đã hết tiền để chơi. Liên hệ anh Tùng để nạp thêm tiền nhé!
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-red-800/50 rounded-lg p-4 border border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-300 font-bold">📱 Số điện thoại:</div>
                <div className="text-yellow-100">0123-456-789</div>
              </div>
              <button
                onClick={() => copyToClipboard("0123456789")}
                className="px-3 py-1 bg-yellow-600 text-red-900 rounded font-bold hover:bg-yellow-500"
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="bg-red-800/50 rounded-lg p-4 border border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-300 font-bold">💬 Zalo:</div>
                <div className="text-yellow-100">0123-456-789</div>
              </div>
              <button
                onClick={() => copyToClipboard("0123456789")}
                className="px-3 py-1 bg-yellow-600 text-red-900 rounded font-bold hover:bg-yellow-500"
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="bg-red-800/50 rounded-lg p-4 border border-yellow-600">
            <div className="text-yellow-300 font-bold mb-2">🏦 Chuyển khoản:</div>
            <div className="text-yellow-100 text-sm space-y-1">
              <div>Ngân hàng: Vietcombank</div>
              <div className="flex items-center justify-between">
                <span>STK: 1234567890</span>
                <button
                  onClick={() => copyToClipboard("1234567890")}
                  className="px-2 py-1 bg-yellow-600 text-red-900 rounded text-xs font-bold hover:bg-yellow-500"
                >
                  {copied ? "✓" : "Copy"}
                </button>
              </div>
              <div>Tên: NGUYEN VAN TUNG</div>
              <div>Nội dung: Nap tien game bau cua</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500"
          >
            Đóng
          </button>
          <button
            onClick={() => window.open("tel:0123456789")}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
          >
            📞 Gọi Ngay
          </button>
        </div>
      </div>
    </div>
  );
}
