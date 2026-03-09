import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  CalendarIcon,
  MessageCircle,
  Gem,
  Sparkles,
  Compass,
  Heart,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';
import { insertContactSubmissionSchema } from '@shared/types';
import { z } from 'zod';

const contactFormSchema = insertContactSubmissionSchema.extend({
  preferredDate: z.date().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [selectedDate, setSelectedDate] = useState<Date>();
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

  const isConsultation = form.watch('isConsultation');

  const handleSubmit = async (data: ContactFormData) => {
    try {
      const submissionData = {
        ...data,
        preferredDate: selectedDate?.toISOString(),
      };

      await apiRequest('POST', '/api/contact', submissionData);

      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours.",
      });

      form.reset();
      setSelectedDate(undefined);
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    }
  };

  const consultationTypes = [
    'Crystal Consultation',
    'Custom Jewelry Design',
    'Energy Reading',
    'Chakra Alignment',
    'Crystal Jewelry Blessing',
    'General Inquiry',
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: 'By Appointment Only' },
  ];

  const services = [
    {
      icon: Gem,
      title: 'Crystal Consultation',
      description: 'Personalized guidance for your spiritual journey',
    },
    {
      icon: Heart,
      title: 'Custom Design',
      description: 'Create unique pieces that resonate with your energy',
    },
    {
      icon: Star,
      title: 'Crystal Services',
      description: 'Cleansing, charging, and blessing your jewelry',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full" style={{
            backgroundColor: 'hsl(var(--gold-soft))',
            color: 'hsl(var(--text-primary))',
            boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
          }}>
            <span className="text-sm font-medium tracking-widest uppercase">
              Crystal Connection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span style={{ color: 'hsl(var(--text-primary))' }}>Contact Us</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />

          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
            Connect with our mystical crystal jewelry artisans. We're here to
            guide your meaningful journey and create pieces that resonate with
            your soul.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card variant="elevated" theme="gradient">
              <CardHeader variant="gradient">
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                  <span className="font-bold text-xl">Send us a Message</span>
                </CardTitle>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>
                  Reach out for personalized guidance on your crystal jewelry
                  journey.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                autoComplete="name"
                                style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
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
                            <FormLabel className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="your@email.com"
                                style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Phone Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="Your phone number"
                              style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Consultation Toggle */}
                    <div className="flex items-center space-x-3">
                      <FormField
                        control={form.control}
                        name="isConsultation"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--accent-vibrant))' }}
                              />
                            </FormControl>
                            <FormLabel className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                              Request Crystal Consultation
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Consultation Type (conditional) */}
                    {isConsultation && (
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                              Consultation Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}>
                                  <SelectValue placeholder="Choose your crystal service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {consultationTypes.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Subject (non-consultation) */}
                    {!isConsultation && (
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                              Subject
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What can we help you with?"
                                style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Preferred Date (consultation only) */}
                    {isConsultation && (
                      <div>
                        <Label className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                          Preferred Consultation Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal mt-2" style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate
                                ? format(selectedDate, 'PPP')
                                : 'Select a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your intentions and how we can assist your spiritual journey..."
                              style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Services */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card variant="elevated" theme="gradient">
              <CardHeader variant="gradient">
                <CardTitle className="flex items-center gap-3">
                  <Compass className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                  <span className="font-bold text-xl">Find Your Way to Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>Email</p>
                      <p style={{ color: 'hsl(var(--text-muted))' }}>hello@trovesandcoves.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>Phone</p>
                      <p style={{ color: 'hsl(var(--text-muted))' }}>+1 (555) 123-GEMS</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>Location</p>
                      <p style={{ color: 'hsl(var(--text-muted))' }}>
                        Online Mystical Boutique
                        <br />
                        Serving Crystal Enthusiasts Worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card variant="elevated" theme="gradient">
              <CardHeader variant="gradient">
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                  <span className="font-bold text-xl">Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0" style={{ borderBottomColor: 'hsl(var(--border-light))' }}
                    >
                      <span className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                        {schedule.day}
                      </span>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-troves-turquoise/10 rounded-lg border border-troves-turquoise/20">
                  <p className="text-sm text-center" style={{ color: 'hsl(var(--text-secondary))' }}>
                    <strong>Online consultations available 24/7</strong>
                    <br />
                    Book your crystal session at your convenience
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card variant="elevated" theme="gradient">
              <CardHeader variant="gradient">
                <CardTitle className="flex items-center gap-3">
                  <Gem className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                  <span className="font-bold text-xl">Crystal Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--border-light))', backgroundColor: 'hsl(var(--bg-card))' }}
                      >
                        <Icon className="h-6 w-6 mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                        <div>
                          <h3 className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                            {service.title}
                          </h3>
                          <p className="text-sm" style={{ color: 'hsl(var(--text-muted))' }}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Response Time Promise */}
        <div className="mt-12 text-center">
          <Card variant="elevated" theme="gradient" className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(var(--accent-vibrant))' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>Our Promise</h3>
              <p className="mb-6" style={{ color: 'hsl(var(--text-secondary))' }}>
                Every message is received with intention and gratitude. We honor
                your trust and will respond within 24 hours, often much sooner.
                For urgent crystal guidance, please mention it in your message.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge
                  variant="outline"
                  style={{ borderColor: 'hsl(var(--accent-vibrant))', color: 'hsl(var(--text-primary))' }}
                >
                  24 Hour Response
                </Badge>
                <Badge
                  variant="outline"
                  style={{ borderColor: 'hsl(var(--accent-vibrant))', color: 'hsl(var(--text-primary))' }}
                >
                  Personal Guidance
                </Badge>
                <Badge
                  variant="outline"
                  style={{ borderColor: 'hsl(var(--border-medium))', color: 'hsl(var(--text-primary))' }}
                >
                  Crystal Connection
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
