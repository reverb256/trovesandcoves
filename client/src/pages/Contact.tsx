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
import { insertContactSubmissionSchema } from '@shared/schema';
import { z } from 'zod';

const contactFormSchema = insertContactSubmissionSchema.extend({
  preferredDate: z.date().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
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
      <section className="relative bg-gradient-to-br from-background via-background-secondary to-background-tertiary text-troves-turquoise overflow-hidden py-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm mb-6">
            <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
              Crystal Connection
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'var(--brand-font-heading)' }}
          >
            <span className="text-navy">Contact Us</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
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
            <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                  <MessageCircle className="h-6 w-6 text-ornate-frame-gold" />
                  <span className="font-bold text-xl">Send us a Message</span>
                </CardTitle>
                <p className="text-navy/80">
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
                            <FormLabel className="text-navy font-semibold">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                className="bg-background-secondary/50 border-ornate-frame-gold/20 text-troves-turquoise placeholder-foreground-muted"
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
                            <FormLabel className="text-navy font-semibold">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-background-secondary/50 border-ornate-frame-gold/20 text-troves-turquoise placeholder-foreground-muted"
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
                              placeholder="Your phone number"
                              className="bg-pearl-cream/50 border-ornate-frame-gold/20 text-navy placeholder-navy/60"
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
                                className="w-4 h-4 text-troves-turquoise bg-background border-ornate-frame-gold rounded focus:ring-troves-turquoise"
                              />
                            </FormControl>
                            <FormLabel className="text-navy font-semibold">
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
                            <FormLabel className="text-navy font-semibold">
                              Consultation Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-pearl-cream/50 border-ornate-frame-gold/20 text-navy">
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
                            <FormLabel className="text-navy font-semibold">
                              Subject
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What can we help you with?"
                                className="bg-background-secondary/50 border-ornate-frame-gold/20 text-troves-turquoise placeholder-foreground-muted"
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
                        <Label className="text-navy font-semibold">
                          Preferred Consultation Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-pearl-cream/50 border-ornate-frame-gold/20 text-navy mt-2"
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
                              className="bg-pearl-cream/50 border-ornate-frame-gold/20 text-navy placeholder-navy/60 min-h-[120px]"
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
            <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                  <Compass className="h-6 w-6 text-ornate-frame-gold" />
                  <span className="font-bold text-xl">Find Your Way to Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-troves-turquoise mt-1" />
                    <div>
                      <p className="font-semibold text-navy">Email</p>
                      <p className="text-navy/70">hello@trovesandcoves.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-troves-turquoise mt-1" />
                    <div>
                      <p className="font-semibold text-navy">Phone</p>
                      <p className="text-navy/70">+1 (555) 123-GEMS</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-troves-turquoise mt-1" />
                    <div>
                      <p className="font-semibold text-navy">Location</p>
                      <p className="text-navy/70">
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
            <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                  <Clock className="h-6 w-6 text-ornate-frame-gold" />
                  <span className="font-bold text-xl">Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-ornate-frame-gold/10 last:border-b-0"
                    >
                      <span className="font-semibold text-navy">
                        {schedule.day}
                      </span>
                      <span className="text-navy/70">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-troves-turquoise/10 rounded-lg border border-troves-turquoise/20">
                  <p className="text-navy/80 text-sm text-center">
                    <strong>Online consultations available 24/7</strong>
                    <br />
                    Book your crystal session at your convenience
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                  <Gem className="h-6 w-6 text-ornate-frame-gold" />
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
                        className="flex items-start space-x-4 p-4 border border-ornate-frame-gold/10 rounded-lg bg-pearl-cream/30"
                      >
                        <Icon className="h-6 w-6 text-troves-turquoise mt-1" />
                        <div>
                          <h3 className="font-semibold text-navy">
                            {service.title}
                          </h3>
                          <p className="text-navy/70 text-sm">
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
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-navy mb-4">Our Promise</h3>
              <p className="text-navy/80 mb-6">
                Every message is received with intention and gratitude. We honor
                your trust and will respond within 24 hours, often much sooner.
                For urgent crystal guidance, please mention it in your message.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge
                  variant="outline"
                  className="border-troves-turquoise text-navy"
                >
                  24 Hour Response
                </Badge>
                <Badge
                  variant="outline"
                  className="border-skull-turquoise text-navy"
                >
                  Personal Guidance
                </Badge>
                <Badge
                  variant="outline"
                  className="border-ornate-frame-gold text-navy"
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
