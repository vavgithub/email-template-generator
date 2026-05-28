"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  generateEmailTemplate,
  type TemplateData,
  type TemplateVersion,
} from "@/lib/email-template";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Copy, Check, Mail, Maximize2, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState<TemplateData>({
    name: "",
    title: "",
    phoneNumber: "",
    email: "",
    meetingLink: "",
    templateVersion: "extended",
  });
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generatedTemplateVersion, setGeneratedTemplateVersion] =
    useState<TemplateVersion | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateVersion: TemplateVersion =
        formData.templateVersion ?? "extended";
      const payload: TemplateData = {
        ...formData,
        templateVersion,
        meetingLink:
          templateVersion === "extended" ? formData.meetingLink : undefined,
      };
      const html = generateEmailTemplate(payload);
      setGeneratedHtml(html);
      setGeneratedTemplateVersion(templateVersion);
      setShowPreview(true);

      // Save to Firestore
      await addDoc(collection(db, "signatures"), {
        name: formData.name,
        title: formData.title,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        ...(templateVersion === "extended" && formData.meetingLink?.trim()
          ? { meetingLink: formData.meetingLink.trim() }
          : {}),
        templateVersion,
        template_html: html,
        created_at: new Date().toISOString(),
      });

      toast.success("Success!", {
        description: "Your email signature has been generated.",
      });
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Error", {
        description: "Failed to generate email signature. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedHtml) return;

    try {
      const type = "text/html";
      const blob = new Blob([generatedHtml], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);

      setCopied(true);
      toast.success("Copied!", {
        description:
          "Signature copied! You can now paste it into your email settings.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support ClipboardItem or blocked permission
      try {
        await navigator.clipboard.writeText(generatedHtml);
        setCopied(true);
        toast.warning("HTML Copied", {
          description:
            "Rich copy failed, but HTML code was copied as a fallback.",
        });
      } catch (e) {
        toast.error("Error", {
          description: "Failed to copy signature.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 lg:py-16 px-4 max-w-7xl ">
        {/* <div className="flex justify-end mb-4 hidden">
          <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 gap-2">
            <Link href="/admin">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>
          </Button>
        </div> */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-8 h-8 md:w-10 md:h-10 text-brand" />
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
              Email Signature Generator
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto px-2">
            Create your personalized MTS email signature. Fill in your
            details below and generate a professional HTML signature for your
            emails.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="shadow-lg max-w-4xl mx-auto w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">
                Your Information
              </CardTitle>
              <CardDescription>
                Enter your details to generate your email signature
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Sam Burkhan"
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="CEO, President"
                      required
                      className="text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number Display *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="(877) 477-9677 ext. 116"
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="yourname@itfgroup.com"
                      required
                      className="text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={cn(
                      "space-y-2",
                      (formData.templateVersion ?? "extended") ===
                        "simplified" && "md:col-span-2",
                    )}
                  >
                    <Label htmlFor="templateVersion">Signature format</Label>
                    <select
                      id="templateVersion"
                      name="templateVersion"
                      value={formData.templateVersion ?? "extended"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          templateVersion: e.target.value as TemplateVersion,
                        }))
                      }
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      )}
                    >
                      <option value="simplified">Simplified version</option>
                      <option value="extended">Extended version</option>
                    </select>
                  </div>

                  {(formData.templateVersion ?? "extended") === "extended" && (
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink">Schedule a call Link</Label>
                      <Input
                        id="meetingLink"
                        name="meetingLink"
                        type="url"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        placeholder="https://meetings.hubspot.com/your-link"
                        className="text-base"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand hover:bg-brand-hover text-slate-900"
                  >
                    {isSubmitting ? "Generating..." : "Generate Signature"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {showPreview && (
            <Card className="shadow-lg max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Preview & Copy</CardTitle>
                <CardDescription>
                  See how your signature will look and copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {generatedHtml && (
                    <>
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <Button
                          onClick={copyToClipboard}
                          size="sm"
                          variant="outline"
                          className="bg-white/80 hover:bg-white"
                          disabled={!generatedHtml}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          {copied ? "Copied!" : "Copy Signature"}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-white/80 hover:bg-white"
                              title="Full Screen Preview"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] h-[90vh] overflow-y-auto p-4 md:p-6">
                            <DialogHeader>
                              <DialogTitle>Email Signature Preview</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 flex justify-center">
                              <div className="border rounded-lg p-4 md:p-8 bg-white shadow-sm w-full max-w-[800px] overflow-x-auto">
                                <div className="min-w-[600px] email-signature-preview">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: generatedHtml,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                  <div
                    className={cn(
                      "border rounded-lg p-2 md:p-4 bg-white overflow-x-auto",
                      generatedTemplateVersion === "extended" &&
                        "min-h-[300px] md:min-h-[500px]",
                    )}
                  >
                    {generatedHtml ? (
                      <div className="min-w-[600px] p-2 email-signature-preview">
                        <div
                          dangerouslySetInnerHTML={{ __html: generatedHtml }}
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center justify-center text-slate-400 text-sm md:text-base",
                          (formData.templateVersion ?? "extended") ===
                            "extended" && "h-[300px] md:h-[500px]",
                          (formData.templateVersion ?? "extended") ===
                            "simplified" && "min-h-[160px] py-8",
                        )}
                      >
                        Fill in the form and click Generate to see your
                        signature
                      </div>
                    )}
                  </div>
                </div>

                {generatedHtml && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      How to use:
                    </h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Click the "Copy Signature" button above</li>
                      <li>
                        Open your email client settings (Outlook, Gmail, etc.)
                      </li>
                      <li>Find the signature section</li>
                      <li>
                        Paste (Ctrl+V or Cmd+V) directly into the signature box
                      </li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
