import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().max(20, "Telefone muito longo").optional(),
  serviceType: z.string().min(1, "Selecione um tipo de serviço"),
  message: z.string().max(1000, "Mensagem muito longa").optional(),
});

interface ContactDialogProps {
  trigger: React.ReactNode;
}

const ContactDialog = ({ trigger }: ContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Erro de validação",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("leads").insert({
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone || null,
        service_type: validation.data.serviceType,
        message: validation.data.message || null,
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        message: "",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-auto rounded-xl">
        <DialogHeader className="space-y-1.5 sm:space-y-2 pb-2">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl leading-tight">
            Fale com um Especialista
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm leading-relaxed">
            Conte-nos sobre seu projeto e entraremos em contato em breve.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
              Nome Completo *
            </Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="serviceType" className="text-xs sm:text-sm font-medium">
              Tipo de Serviço *
            </Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              required
            >
              <SelectTrigger id="serviceType" className="h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site">Site Institucional</SelectItem>
                <SelectItem value="landing-page">Landing Page</SelectItem>
                <SelectItem value="web-app">Web App</SelectItem>
                <SelectItem value="sistema">Sistema Personalizado</SelectItem>
                <SelectItem value="automacao-ia">Automação com IA</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="message" className="text-xs sm:text-sm font-medium">
              Mensagem
            </Label>
            <Textarea
              id="message"
              placeholder="Conte-nos mais sobre seu projeto..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="resize-none text-sm min-h-[70px] sm:min-h-[80px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-highlight text-sm h-10 sm:h-11 mt-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Enviar Mensagem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
