import { useState } from "react";
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

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");
  const [transactionRef, setTransactionRef] = useState("");
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  
  // Mock data - in real app this would come from cart/course selection
  const orderData = location.state || {
    type: "course",
    title: "Advanced UI/UX Design",
    price: 299,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"
  };
  
  // Mock wallet balance
  const walletBalance = 500;
  
  const paymentMethods = [
    {
      id: "wallet",
      name: "المحفظة",
      nameEn: "Wallet",
      icon: Wallet,
      description: `الرصيد المتاح: ${walletBalance} ج.م`,
      disabled: walletBalance < orderData.price
    },
    {
      id: "instapay",
      name: "انستا باي",
      nameEn: "InstaPay",
      icon: CreditCard,
      description: "تحويل فوري",
      details: "mina_boules@instapay"
    },
    {
      id: "vodafone",
      name: "فودافون كاش",
      nameEn: "Vodafone Cash",
      icon: Smartphone,
      description: "محفظة إلكترونية",
      details: "01014959132"
    }
  ];

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
      title: "تم النسخ!",
      description: `تم نسخ ${type === "instapay" ? "حساب انستا باي" : "رقم فودافون كاش"}`,
    });
  };

  const handleCheckout = () => {
    if (paymentMethod === "wallet") {
      if (walletBalance >= orderData.price) {
        toast({
          title: "تم الدفع بنجاح! ✓",
          description: "تم خصم المبلغ من محفظتك",
        });
        navigate("/profile");
      } else {
        toast({
          title: "رصيد غير كافي",
          description: "يرجى شحن المحفظة أو اختيار طريقة دفع أخرى",
          variant: "destructive"
        });
      }
    } else {
      if (!transactionRef.trim()) {
        toast({
          title: "مطلوب رقم العملية",
          description: "يرجى إدخال رقم العملية/المرجع للتحقق",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "تم إرسال طلبك! ⏳",
        description: "سيتم تفعيل الكورس خلال 24 ساعة بعد التحقق من الدفع",
      });
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-24 bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img 
                      src={orderData.image} 
                      alt={orderData.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{orderData.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{orderData.type}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">السعر</span>
                      <span>{orderData.price} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الخصم</span>
                      <span className="text-green-500">0 ج.م</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">{orderData.price} ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>دفع آمن ومشفر 100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>اختر طريقة الدفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
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
                              <div className={`p-2 rounded-lg ${
                                method.id === "wallet" ? "bg-amber-500/20 text-amber-500" :
                                method.id === "instapay" ? "bg-blue-500/20 text-blue-500" :
                                "bg-red-500/20 text-red-500"
                              }`}>
                                <method.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-xs text-muted-foreground">{method.nameEn}</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{method.description}</p>
                            
                            {method.disabled && (
                              <p className="text-xs text-destructive mt-1">رصيد غير كافي</p>
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
                      <h4 className="font-medium text-blue-400">خطوات الدفع عبر انستا باي:</h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>افتح تطبيق البنك الخاص بك</li>
                        <li>اختر التحويل عبر انستا باي</li>
                        <li>أدخل الحساب التالي:</li>
                      </ol>
                      <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                        <code className="flex-1 text-blue-400 font-mono">mina_boules@instapay</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard("mina_boules@instapay", "instapay")}
                        >
                          {copiedInstapay ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">4. أدخل المبلغ: <strong className="text-foreground">{orderData.price} ج.م</strong></p>
                      
                      <div className="pt-4 border-t border-blue-500/20">
                        <Label htmlFor="ref-instapay" className="text-sm">رقم العملية / المرجع</Label>
                        <Input 
                          id="ref-instapay"
                          placeholder="أدخل رقم العملية بعد التحويل"
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
                      <h4 className="font-medium text-red-400">خطوات الدفع عبر فودافون كاش:</h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>افتح تطبيق فودافون كاش</li>
                        <li>اختر تحويل أموال</li>
                        <li>أدخل الرقم التالي:</li>
                      </ol>
                      <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                        <code className="flex-1 text-red-400 font-mono text-lg">01014959132</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard("01014959132", "vodafone")}
                        >
                          {copiedVodafone ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">4. أدخل المبلغ: <strong className="text-foreground">{orderData.price} ج.م</strong></p>
                      
                      <div className="pt-4 border-t border-red-500/20">
                        <Label htmlFor="ref-vodafone" className="text-sm">رقم العملية / المرجع</Label>
                        <Input 
                          id="ref-vodafone"
                          placeholder="أدخل رقم العملية بعد التحويل"
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
                          <p className="text-sm text-muted-foreground">رصيد المحفظة الحالي</p>
                          <p className="text-2xl font-bold text-amber-500">{walletBalance} ج.م</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">بعد الشراء</p>
                          <p className="text-2xl font-bold text-foreground">{walletBalance - orderData.price} ج.م</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {paymentMethod === "wallet" ? "ادفع الآن" : "تأكيد الدفع"}
                    <span className="mr-2">{orderData.price} ج.م</span>
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
