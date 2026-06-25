import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractPreview } from "@/components/contracts/ContractPreview";
import { maskCpfCnpj } from "@/lib/contractConfig";
import { generateContractPdf } from "@/lib/contractPdf";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Download, Eraser, ArrowLeft, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

type Contract = {
  id: string;
  token: string;
  issue_date: string;
  client_name: string | null;
  client_document: string | null;
  client_address: string | null;
  client_signature: string | null;
  contract_value: number | null;
  status: "pending" | "signed";
};

export default function ContractSign() {
  const { token } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [address, setAddress] = useState("");

  const sigRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("token", token!)
        .maybeSingle();
      if (error || !data) {
        toast({ title: "Contrato não encontrado", variant: "destructive" });
      } else {
        setContract(data as Contract);
        if (data.client_name) setName(data.client_name);
        if (data.client_document) setDoc(data.client_document);
        if (data.client_address) setAddress(data.client_address);
      }
      setLoading(false);
    })();
  }, [token]);

  async function handleFinish() {
    if (!contract) return;
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast({ title: "Desenhe sua assinatura antes de finalizar", variant: "destructive" });
      return;
    }
    setSaving(true);
    const signature = sigRef.current.toDataURL("image/png");
    const { data, error } = await supabase
      .from("contracts")
      .update({
        client_name: name,
        client_document: doc,
        client_address: address,
        client_signature: signature,
        status: "signed",
        signed_at: new Date().toISOString(),
      })
      .eq("token", token!)
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      toast({ title: "Erro ao assinar", description: error?.message, variant: "destructive" });
      return;
    }
    setContract(data as Contract);
    toast({ title: "Contrato assinado com sucesso!" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Contrato não encontrado</h1>
          <p className="text-muted-foreground">Verifique se o link está correto.</p>
        </div>
      </div>
    );
  }

  if (contract.status === "signed") {
    return (
      <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Contrato Assinado</h1>
          <p className="text-muted-foreground mb-6">
            Este contrato já foi assinado por <strong>{contract.client_name}</strong>.
          </p>
          <Button
            size="lg"
            onClick={() => generateContractPdf(contract, `contrato-${contract.client_name}.pdf`)}
          >
            <Download className="h-5 w-5 mr-2" /> Baixar PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="CASE" className="h-14 w-14" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`px-3 py-1 rounded-full ${
                step === n ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {n}. {n === 1 ? "Dados" : n === 2 ? "Prévia" : "Assinatura"}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Preencha seus dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome completo / Razão Social *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
              </div>
              <div>
                <Label>CPF / CNPJ *</Label>
                <Input
                  value={doc}
                  onChange={(e) => setDoc(maskCpfCnpj(e.target.value))}
                  maxLength={20}
                />
              </div>
              <div>
                <Label>Endereço completo *</Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  maxLength={300}
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!name.trim() || !doc.trim() || !address.trim()}
                className="w-full"
              >
                Continuar <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div>
            <Card className="mb-4">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Confira abaixo o contrato com seus dados preenchidos. Se estiver tudo correto,
                  prossiga para a assinatura.
                </p>
              </CardContent>
            </Card>
            <div className="overflow-auto bg-muted p-2 sm:p-6 rounded-lg">
              <div style={{ transform: "scale(var(--zoom, 1))", transformOrigin: "top center" }}>
                <ContractPreview
                  issueDate={contract.issue_date}
                  clientName={name}
                  clientDocument={doc}
                  clientAddress={address}
                  contractValue={contract.contract_value}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Ir para assinatura <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Desenhe sua assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg bg-white overflow-hidden">
                <SignatureCanvas
                  ref={(r) => (sigRef.current = r)}
                  canvasProps={{
                    className: "w-full",
                    style: { width: "100%", height: 220, touchAction: "none" },
                  }}
                  penColor="#0a0a23"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sigRef.current?.clear()}
                >
                  <Eraser className="h-4 w-4 mr-2" /> Limpar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleFinish} disabled={saving} className="flex-1">
                  {saving ? "Finalizando..." : "Finalizar e Assinar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Ao clicar em "Finalizar e Assinar", você concorda integralmente com os termos
                do contrato apresentado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}