import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Activity,
  Users,
  ShoppingCart,
  TrendingUp,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SystemStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: string;
  securityAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type:
    | 'authentication'
    | 'validation'
    | 'rate_limit'
    | 'privacy'
    | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip?: string;
  userId?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: 90,
    encryptionEnabled: true,
    anonymizationEnabled: true,
    auditLogging: true,
    complianceMode: 'canadian',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, securityRes] = await Promise.all([
        apiRequest('GET', '/api/admin/stats'),
        apiRequest('GET', '/api/admin/security-events'),
      ]);

      const [statsData, securityData] = await Promise.all([
        statsRes.json(),
        securityRes.json(),
      ]);

      setStats(statsData);
      setSecurityEvents(securityData.events || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportSecurityReport = async () => {
    try {
      const response = await apiRequest('GET', '/api/admin/security-report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export security report:', error);
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-2">
          {stats && getHealthIcon(stats.systemHealth)}
          <span className="text-sm text-gray-600">System Status</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalRevenue || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Alerts
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.securityAlerts || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Events
                </CardTitle>
                <Button
                  onClick={exportSecurityReport}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.slice(0, 10).map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-gray-600">
                            {event.timestamp.toLocaleString()} | Type:{' '}
                            {event.type}
                          </p>
                        </div>
                      </div>
                      {event.ip && (
                        <Badge variant="outline" className="text-xs">
                          {event.ip}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy & Compliance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  System is compliant with PIPEDA (Personal Information
                  Protection and Electronic Documents Act) and Canadian
                  regulations.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encryption">Data Encryption</Label>
                    <Switch
                      id="encryption"
                      checked={privacySettings.encryptionEnabled}
                      onCheckedChange={checked =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          encryptionEnabled: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="anonymization">Data Anonymization</Label>
                    <Switch
                      id="anonymization"
                      checked={privacySettings.anonymizationEnabled}
                      onCheckedChange={checked =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          anonymizationEnabled: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit">Audit Logging</Label>
                    <Switch
                      id="audit"
                      checked={privacySettings.auditLogging}
                      onCheckedChange={checked =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          auditLogging: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="retention">Data Retention (days)</Label>
                    <Input
                      id="retention"
                      type="number"
                      value={privacySettings.dataRetention}
                      onChange={e =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          dataRetention: Number(e.target.value),
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="compliance">Compliance Framework</Label>
                    <select
                      id="compliance"
                      value={privacySettings.complianceMode}
                      onChange={e =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          complianceMode: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="canadian">Canadian (PIPEDA)</option>
                      <option value="gdpr">European (GDPR)</option>
                      <option value="ccpa">California (CCPA)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
