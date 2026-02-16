
import { Router } from 'express';
import { redundancyAuditor } from '../audit/redundancy-audit';

const router = Router();

router.get('/redundancy-audit', async (req, res) => {
  try {
    console.log('🔍 Starting redundancy audit...');
    const report = await redundancyAuditor.runFullAudit();
    
    res.json({
      success: true,
      audit: report,
      summary: {
        status: report.systemHealth,
        totalIssues: report.totalIssues,
        criticalIssues: report.criticalIssues,
        performanceGain: report.estimatedPerformanceGain,
        codeReduction: report.estimatedCodeReduction
      }
    });
  } catch (error: any) {
    console.error('Audit failed:', error);
    res.status(500).json({
      success: false,
      error: 'Audit execution failed',
      details: error.message
    });
  }
});

router.get('/optimization-plan', async (req, res) => {
  try {
    console.log('📋 Generating optimization plan...');
    const plan = await redundancyAuditor.generateOptimizationPlan();
    
    res.json({
      success: true,
      plan,
      contentType: 'markdown'
    });
  } catch (error: any) {
    console.error('Plan generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Plan generation failed',
      details: error.message
    });
  }
});

export default router;
