import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Mail, MapPin, ShoppingBag } from 'lucide-react';
import { insertContactSubmissionSchema } from '@shared/types';
import { z } from 'zod';
import SEOHead from '@/components/SEOHead';
import { BreadcrumbSchema } from '@/components/SchemaOrg';

const contactFormSchema = insertContactSubmissionSchema.extend({
  preferredDate: z.date().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      isConsultation: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      await apiRequest('POST', '/api/contact', data);

      toast({
        title: 'Message received',
        description: "We'll respond within 24 hours.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Unable to send message',
        description: 'Please email us directly at info@trovesandcoves.ca',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SEOHead path="/contact" />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' }
        ]}
      />
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      {/* Header */}
      <section className="py-24">
        <div className="chamber-container text-center max-w-2xl">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: '"Libre Baskerville", serif',
              color: 'hsl(var(--text-primary))',
            }}
          >
            Get in Touch
          </h1>
          <div
            className="w-16 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: 'hsl(var(--gold-medium))' }}
          />
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
          >
            For custom orders, design consultations, or any questions about our
            handcrafted crystal jewelry, we'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="chamber-container pb-20">
        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card
              className="border-0 shadow-sm"
              style={{ backgroundColor: 'hsl(var(--bg-card))' }}
            >
              <CardContent className="p-8 md:p-10">
                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    color: 'hsl(var(--text-primary))',
                  }}
                >
                  Send a Message
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium"
                            style={{
                              color: 'hsl(var(--text-primary))',
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              autoComplete="name"
                              className="border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                              style={{
                                backgroundColor: 'hsl(var(--bg-primary))',
                                borderColor: 'hsl(var(--border-medium))',
                                fontFamily: '"Montserrat", sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium"
                            style={{
                              color: 'hsl(var(--text-primary))',
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              placeholder="your@email.com"
                              className="border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                              style={{
                                backgroundColor: 'hsl(var(--bg-primary))',
                                borderColor: 'hsl(var(--border-medium))',
                                fontFamily: '"Montserrat", sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium"
                            style={{
                              color: 'hsl(var(--text-primary))',
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help?"
                              className="border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                              style={{
                                backgroundColor: 'hsl(var(--bg-primary))',
                                borderColor: 'hsl(var(--border-medium))',
                                fontFamily: '"Montserrat", sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-sm font-medium"
                            style={{
                              color: 'hsl(var(--text-primary))',
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your custom order or inquiry..."
                              className="min-h-[140px] border-gray-200 focus:border-gray-400 focus:ring-gray-200 resize-none"
                              style={{
                                backgroundColor: 'hsl(var(--bg-primary))',
                                borderColor: 'hsl(var(--border-medium))',
                                fontFamily: '"Montserrat", sans-serif',
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full py-3 text-sm font-medium tracking-wide transition-all duration-200 hover:opacity-90"
                      style={{
                        backgroundColor: 'hsl(var(--text-primary))',
                        color: 'hsl(var(--bg-primary))',
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      Send Message
                    </Button>
                  </form>
                </Form>

                <p
                  className="text-sm text-center mt-6"
                  style={{ color: 'hsl(var(--text-muted))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  We typically respond within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Card */}
            <Card
              className="border-0 shadow-sm"
              style={{ backgroundColor: 'hsl(var(--bg-card))' }}
            >
              <CardContent className="p-8">
                <h3
                  className="text-lg font-semibold mb-6"
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    color: 'hsl(var(--text-primary))',
                  }}
                >
                  Contact Information
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Mail
                      className="h-5 w-5 mt-0.5 flex-shrink-0"
                      style={{ color: 'hsl(var(--gold-medium))' }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{
                          color: 'hsl(var(--text-primary))',
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        Email
                      </p>
                      <a
                        href="mailto:info@trovesandcoves.ca"
                        className="text-sm hover:underline transition-colors"
                        style={{
                          color: 'hsl(var(--accent-vibrant))',
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        info@trovesandcoves.ca
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      className="h-5 w-5 mt-0.5 flex-shrink-0"
                      style={{ color: 'hsl(var(--gold-medium))' }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{
                          color: 'hsl(var(--text-primary))',
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        Location
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: 'hsl(var(--text-secondary))',
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        Winnipeg, Manitoba
                        <br />
                        Canada
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card
              className="border-0 shadow-sm"
              style={{ backgroundColor: 'hsl(var(--bg-card))' }}
            >
              <CardContent className="p-8">
                <h3
                  className="text-lg font-semibold mb-6"
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    color: 'hsl(var(--text-primary))',
                  }}
                >
                  Follow Us
                </h3>

                <div className="space-y-4">
                  <a
                    href="https://www.etsy.com/ca/shop/TrovesandCoves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    <ShoppingBag
                      className="h-5 w-5"
                      style={{ color: 'hsl(var(--accent-vibrant))' }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'hsl(var(--text-primary))' }}
                      >
                        Etsy Shop
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(var(--text-muted))' }}>
                        Browse our collection
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/Troves_and_Coves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: 'hsl(var(--accent-vibrant))' }}
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.012.057-.353 1.085-.232 1.614-.053 1.877-.208.856.528 1.58 1.067 2.355c.537 1.378 1.52 2.25 1.52 4.025 0 2.447-.01 3.557-.602 4.317-.39.814-.57-.763-1.28-.876-1.004-.233-.232-.43-.448-.585-.646-.264-.312-.413-.585-.413-.585 0-.373.148-.585.413-.585.413 0 .083.012.17.035.256.11.153.247.325.476.667.59 1.107.336.696.645 1.12.645.424 0 .763-.108 1.34-.264 1.732-.455.474-.39.85-.866-1.13-1.453-.308-.526-.61-1.046-.91-1.566-.326-.685-.568-1.02-.568-1.485 0-.846.31-1.577.924-2.176 1.584-.726 1.576-1.636 2.604-.865 1.72-1.363 2.454-.726.892-1.21 1.538-1.21 2.454 0 .537.033.815.11.96.066.347.1.697.17 1.038.274 1.455.472.51.875.983.496 1.322.42.383.86.52 1.086.472 1.732.472.872 0 1.763-.508 2.866-1.394.782-.946 1.276-1.41 1.938-1.41 3.356 0 1.19-.367 2.188-1.1 2.987-.63.794-1.12-1.538-1.12-2.587 0-.855.308-1.533.924-2.032 1.584-.63 1.874-1.41 2.604-2.374.803-.983 1.26-1.484 2.03-1.484 3.27 0 .983.37 1.87 1.11 2.613.42.622.876.938.998 1.365.12.448.01 1.564.01 2.453-.002.887-.002 1.763-.508 2.866-1.394.782-.946 1.276-1.41 1.938-1.41 3.356 0 1.19-.367 2.188-1.1 2.987-.63.794-1.12-1.538-1.12-2.587 0-.855.308-1.533.924-2.032 1.584-.63 1.874-1.41 2.604-2.374.803-.983 1.26-1.484 2.03-1.484 3.27 0 .983.37 1.87 1.11 2.613.42.622.876.938.998 1.365.12.448.01 1.564.01 2.453z"/>
                    </svg>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'hsl(var(--text-primary))' }}
                      >
                        Instagram
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(var(--text-muted))' }}>
                        @Troves_and_Coves
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://www.facebook.com/trovesandcoves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                  >
                    <div
                      className="h-5 w-5 flex items-center justify-center text-xs font-bold rounded-sm"
                      style={{
                        backgroundColor: 'hsl(var(--accent-vibrant))',
                        color: 'hsl(var(--bg-overlay))',
                      }}
                    >
                      f
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'hsl(var(--text-primary))' }}
                      >
                        Facebook
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(var(--text-muted))' }}>
                        Troves & Coves
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
