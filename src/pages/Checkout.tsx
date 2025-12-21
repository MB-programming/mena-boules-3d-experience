import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, Smartphone, CreditCard, Copy, Check, ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

type CheckoutOrderData = {
  type: "course" | "project" | string;
  title: string;
  price: number;
  image: string;
  courseId?: string;
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const isAr = language === "ar";
  const txt = (ar: string, en: string) => (isAr ? ar : en);
  const currency = isAr ? "ج.م" : "EGP";

  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");
  const [transactionRef, setTransactionRef] = useState("");
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);

  // Mock data - in real app this would come from cart/course selection
  const orderData: CheckoutOrderData = (location.state as CheckoutOrderData) || {
    type: "course",
    title: "Advanced UI/UX Design",
    price: 299,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
  };

  // Mock wallet balance
  const walletBalance = 500;

  const paymentMethods = useMemo(
    () => [
      {
        id: "wallet",
        name: txt("المحفظة", "Wallet"),
        icon: Wallet,
        description: txt(`الرصيد المتاح: ${walletBalance} ج.م`, `Available balance: ${walletBalance} EGP`),
        disabled: walletBalance < orderData.price,
      },
      {
        id: "instapay",
        name: txt("انستا باي", "InstaPay"),
        icon: CreditCard,
        description: txt("تحويل فوري", "Instant transfer"),
        details: "mina_boules@instapay",
      },
      {
        id: "vodafone",
        name: txt("فودافون كاش", "Vodafone Cash"),
        icon: Smartphone,
        description: txt("محفظة إلكترونية", "Mobile wallet"),
        details: "01014959132",
      },
    ],
    [isAr, orderData.price, txt, walletBalance]
  );

  useEffect(() => {
    const title = txt("الدفع | مينا بولس", "Checkout | Mena Boules");
    document.title = title.length > 60 ? title.slice(0, 60) : title;

    const description = txt(
      "اختر طريقة الدفع: المحفظة أو انستا باي أو فودافون كاش لإتمام طلبك.",
      "Choose Wallet, InstaPay, or Vodafone Cash to complete your order."
    );

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description.length > 160 ? description.slice(0, 160) : description;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/checkout`;
  }, [txt]);

  const copyToClipboard = (text: string, type: "instapay" | "vodafone") => {
    navigator.clipboard.writeText(text);
    if (type === "instapay") {
      setCopiedInstapay(true);
      setTimeout(() => setCopiedInstapay(false), 2000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2000);
    }

    toast({
      title: txt("تم النسخ!", "Copied!"),
      description: txt(
        `تم نسخ ${type === "instapay" ? "حساب انستا باي" : "رقم فودافون كاش"}`,
        `Copied ${type === "instapay" ? "InstaPay account" : "Vodafone Cash number"}`
      ),
    });
  };

  const handleCheckout = () => {
    if (paymentMethod === "wallet") {
      if (walletBalance >= orderData.price) {
        toast({
          title: txt("تم الدفع بنجاح!", "Payment successful!"),
          description: txt("تم خصم المبلغ من محفظتك", "The amount was deducted from your wallet."),
        });
        navigate("/profile");
      } else {
        toast({
          title: txt("رصيد غير كافي", "Insufficient balance"),
          description: txt(
            "يرجى شحن المحفظة أو اختيار طريقة دفع أخرى",
            "Please top up your wallet or choose another payment method."
          ),
          variant: "destructive",
        });
      }
    } else {
      if (!transactionRef.trim()) {
        toast({
          title: txt("مطلوب رقم العملية", "Transaction reference required"),
          description: txt("يرجى إدخال رقم العملية/المرجع للتحقق", "Please enter a transaction reference for verification."),
          variant: "destructive",
        });
        return;
      }
      toast({
        title: txt("تم إرسال طلبك!", "Request submitted!"),
        description: txt(
          "سيتم تفعيل الكورس خلال 24 ساعة بعد التحقق من الدفع",
          "Your access will be activated within 24 hours after payment verification."
        ),
      });
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-6 space-y-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              {txt("الدفع", "Checkout")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {txt("اختر طريقة الدفع لإتمام طلبك.", "Choose a payment method to complete your order.")}
            </p>
          </header>

          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            {txt("رجوع", "Back")}
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-24 bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{txt("ملخص الطلب", "Order Summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={orderData.image}
                      alt={orderData.title}
                      className="w-20 h-20 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{orderData.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{orderData.type}</p>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{txt("السعر", "Price")}</span>
                      <span>
                        {orderData.price} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{txt("الخصم", "Discount")}</span>
                      <span className="text-green-500">
                        0 {currency}
                      </span>
                    </div>
                    <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
                      <span>{txt("الإجمالي", "Total")}</span>
                      <span className="text-primary">
                        {orderData.price} {currency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>{txt("دفع آمن ومشفر 100%", "100% secure encrypted payment")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>{txt("اختر طريقة الدفع", "Choose a payment method")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentMethods.map((method) => (
                      <motion.div key={method.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Label
                          htmlFor={method.id}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-border"
                          } ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            disabled={method.disabled}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  method.id === "wallet"
                                    ? "bg-amber-500/20 text-amber-500"
                                    : method.id === "instapay"
                                      ? "bg-blue-500/20 text-blue-500"
                                      : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                <method.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">{method.name}</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{method.description}</p>

                            {method.disabled && (
                              <p className="text-xs text-destructive mt-1">
                                {txt("رصيد غير كافي", "Insufficient balance")}
                              </p>
                            )}
                          </div>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>

                  {/* Payment Details */}
                  {paymentMethod === "instapay" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
                    >
                      <h4 className="font-medium text-blue-400">
                        {txt("خطوات الدفع عبر انستا باي:", "InstaPay steps:")}
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>{txt("افتح تطبيق البنك الخاص بك", "Open your banking app")}</li>
                        <li>{txt("اختر التحويل عبر انستا باي", "Choose InstaPay transfer")}</li>
                        <li>{txt("أدخل الحساب التالي:", "Enter this account:")}</li>
                      </ol>
                      <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                        <code className="flex-1 text-blue-400 font-mono">mina_boules@instapay</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("mina_boules@instapay", "instapay")}
                        >
                          {copiedInstapay ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {txt("4. أدخل المبلغ:", "4. Enter amount:")}{" "}
                        <strong className="text-foreground">
                          {orderData.price} {currency}
                        </strong>
                      </p>

                      <div className="pt-4 border-t border-blue-500/20">
                        <Label htmlFor="ref-instapay" className="text-sm">
                          {txt("رقم العملية / المرجع", "Transaction reference")}
                        </Label>
                        <Input
                          id="ref-instapay"
                          placeholder={txt("أدخل رقم العملية بعد التحويل", "Enter the reference after transfer")}
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          className="mt-2 bg-background/50"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "vodafone" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20"
                    >
                      <h4 className="font-medium text-red-400">
                        {txt("خطوات الدفع عبر فودافون كاش:", "Vodafone Cash steps:")}
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>{txt("افتح تطبيق فودافون كاش", "Open Vodafone Cash")}</li>
                        <li>{txt("اختر تحويل أموال", "Choose Send Money")}</li>
                        <li>{txt("أدخل الرقم التالي:", "Enter this number:")}</li>
                      </ol>
                      <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                        <code className="flex-1 text-red-400 font-mono text-lg">01014959132</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard("01014959132", "vodafone")}>
                          {copiedVodafone ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {txt("4. أدخل المبلغ:", "4. Enter amount:")}{" "}
                        <strong className="text-foreground">
                          {orderData.price} {currency}
                        </strong>
                      </p>

                      <div className="pt-4 border-t border-red-500/20">
                        <Label htmlFor="ref-vodafone" className="text-sm">
                          {txt("رقم العملية / المرجع", "Transaction reference")}
                        </Label>
                        <Input
                          id="ref-vodafone"
                          placeholder={txt("أدخل رقم العملية بعد التحويل", "Enter the reference after transfer")}
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          className="mt-2 bg-background/50"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "wallet" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {txt("رصيد المحفظة الحالي", "Current wallet balance")}
                          </p>
                          <p className="text-2xl font-bold text-amber-500">
                            {walletBalance} {currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{txt("بعد الشراء", "After purchase")}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {walletBalance - orderData.price} {currency}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {paymentMethod === "wallet"
                      ? txt("ادفع الآن", "Pay now")
                      : txt("تأكيد الدفع", "Confirm payment")}
                    <span className={isAr ? "mr-2" : "ml-2"}>
                      {orderData.price} {currency}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
