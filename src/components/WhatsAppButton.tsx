import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const hiddenRoutes = ["/membro", "/admin/dashboard", "/admin/login", "/login", "/convite"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  const phone = "5522999443332";
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a CaseEJ.");

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${phone}&text=${message}`}
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