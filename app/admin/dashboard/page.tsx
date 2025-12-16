'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, Eye, Copy, Check, Users, Calendar, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';

export type EmailSignature = {
  id: string;
  name: string;
  title: string;
  linkedin_url?: string;
  facebook_url?: string;
  phoneNumber: string;
  address?: string;
  website_url?: string;
  website_display?: string;
  email: string;
  meetingLink?: string;
  template_html: string;
  created_at: string;
};

// Mock data
const MOCK_SIGNATURES: EmailSignature[] = [
  {
    id: '1',
    name: 'John Doe',
    title: 'Software Engineer',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    facebook_url: '',
    phoneNumber: '(555) 123-4567',
    address: '123 Tech Lane, Silicon Valley, CA',
    website_url: 'https://itfgroup.com',
    website_display: 'www.itfgroup.com',
    email: 'john.doe@itfgroup.com',
    meetingLink: 'https://meetings.hubspot.com/john-doe',
    template_html: '<div>Mock Signature HTML</div>',
    created_at: new Date().toISOString(),
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin');
      } else {
        fetchSignatures();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSignatures = async () => {
    try {
      const q = query(collection(db, 'signatures'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedSignatures: EmailSignature[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EmailSignature));
      
      setSignatures(fetchedSignatures);
    } catch (error) {
      console.error('Error fetching signatures:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch signatures.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin');
  };

  const copyToClipboard = (html: string) => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'HTML code copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Manage email signature submissions</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="w-4 h-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{signatures.length}</div>
              <p className="text-xs text-slate-600 mt-1">Email signatures generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Submission</CardTitle>
              <Calendar className="w-4 h-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {signatures.length > 0 ? format(new Date(signatures[0].created_at), 'MMM dd') : 'N/A'}
              </div>
              <p className="text-xs text-slate-600 mt-1">Most recent activity</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
              <Mail className="w-4 h-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-slate-600 mt-1">ITF Group template</p>
            </CardContent>
          </Card> */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>View and manage all email signature submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading submissions...</div>
              </div>
            ) : signatures.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400">No submissions yet</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signatures.map((signature) => (
                      <TableRow key={signature.id}>
                        <TableCell className="font-medium">{signature.name}</TableCell>
                        <TableCell>{signature.title}</TableCell>
                        <TableCell className="text-sm">{signature.email}</TableCell>
                        <TableCell className="text-sm">{signature.phoneNumber}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(signature.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => setSelectedSignature(signature)}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{signature.name} - Email Signature</DialogTitle>
                                <DialogDescription>
                                  Created on {format(new Date(signature.created_at), 'MMMM dd, yyyy at h:mm a')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Full Name</p>
                                    <p className="text-sm">{signature.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Job Title</p>
                                    <p className="text-sm">{signature.title}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Email</p>
                                    <p className="text-sm">{signature.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Phone</p>
                                    <p className="text-sm">{signature.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Website</p>
                                    <p className="text-sm">{signature.website_display || 'www.itfgroup.com'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Address</p>
                                    <p className="text-sm">{signature.address || '11990 Missouri Bottom Road Hazelwood, MO 63042'}</p>
                                  </div>
                                  {signature.meetingLink && (
                                    <div className="col-span-2">
                                      <p className="text-xs font-semibold text-slate-600 mb-1">Meeting Link</p>
                                      <p className="text-sm truncate text-blue-600 hover:underline">
                                        <a href={signature.meetingLink} target="_blank" rel="noopener noreferrer">
                                          {signature.meetingLink}
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm">Preview</h3>
                                    <Button
                                      onClick={() => copyToClipboard(signature.template_html)}
                                      size="sm"
                                      variant="outline"
                                      className="gap-2"
                                    >
                                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                      {copied ? 'Copied!' : 'Copy Signature'}
                                    </Button>
                                  </div>
                                  <div className="border rounded-lg p-4 bg-white overflow-auto min-h-[300px]">
                                    <div className="email-signature-preview">
                                      <div dangerouslySetInnerHTML={{ __html: signature.template_html }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
