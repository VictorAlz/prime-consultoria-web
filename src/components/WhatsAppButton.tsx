import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phone = "5522999443322";
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a CaseEJ.");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
    </a>
  );
};

export default WhatsAppButton;