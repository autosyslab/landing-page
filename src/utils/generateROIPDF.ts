import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ROIData {
  name: string;
  email: string;
  company?: string;
  hoursSaved: number;
  monthlySavings: number;
  annualSavings: number;
  monthlyHours: number;
  hourlyCost: number;
  employees: number;
  coverage: number;
}

export const generateROIPDF = (data: ROIData): jsPDF => {
  const doc = new jsPDF();

  const primaryColor: [number, number, number] = [6, 182, 212];
  const secondaryColor: [number, number, number] = [59, 130, 246];
  const accentColor: [number, number, number] = [249, 115, 22];
  const darkColor: [number, number, number] = [15, 23, 42];
  const lightColor: [number, number, number] = [241, 245, 249];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 50, pageWidth, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('AutoSys Lab', 20, 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Automation ROI Report', 20, 35);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, pageWidth - 20, 25, { align: 'right' });

  let yPos = 75;

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared For:', 20, yPos);

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.name}`, 20, yPos);

  yPos += 7;
  doc.text(`Email: ${data.email}`, 20, yPos);

  if (data.company) {
    yPos += 7;
    doc.text(`Company: ${data.company}`, 20, yPos);
  }

  yPos += 20;

  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
  doc.roundedRect(15, yPos, pageWidth - 30, 50, 3, 3, 'F');

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, yPos, pageWidth - 30, 50, 3, 3, 'S');

  yPos += 10;
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`By automating ${data.coverage}% of your team's manual work, you can save`, 20, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFontSize(13);
  doc.text(`${data.hoursSaved} hours per month and ${formatCurrency(data.annualSavings)} annually.`, 20, yPos);

  yPos += 8;
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('This translates to increased productivity, reduced costs, and faster growth.', 20, yPos);

  yPos += 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Your ROI Breakdown', 20, yPos);

  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Hours Saved Monthly', `${data.hoursSaved.toLocaleString()} hours`],
      ['Monthly Cost Savings', formatCurrency(data.monthlySavings)],
      ['Annual Financial Gain', formatCurrency(data.annualSavings)],
      ['Team Members Affected', data.employees.toString()],
      ['Automation Coverage', `${data.coverage}%`],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: darkColor,
    },
    alternateRowStyles: {
      fillColor: lightColor,
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Calculation Inputs', 20, yPos);

  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Parameter', 'Your Input']],
    body: [
      ['Monthly Hours on Manual Tasks', `${data.monthlyHours} hours/employee`],
      ['Hourly Cost (incl. benefits)', formatCurrency(data.hourlyCost)],
      ['Number of Employees', data.employees.toString()],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: darkColor,
    },
    columnStyles: {
      0: { cellWidth: 100, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('What This Means For Your Business', 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const benefits = [
    `✓ Reclaim ${data.hoursSaved} hours monthly for strategic work`,
    `✓ Reduce operational costs by ${formatCurrency(data.monthlySavings)} per month`,
    `✓ Improve team productivity by ${Math.round(data.coverage)}%`,
    `✓ Scale operations without proportional headcount increase`,
    `✓ Eliminate repetitive tasks that drain employee morale`,
    `✓ Gain competitive advantage through faster execution`,
  ];

  benefits.forEach((benefit) => {
    doc.text(benefit, 25, yPos);
    yPos += 7;
  });

  yPos += 10;

  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, yPos - 5, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Get Started?', 20, yPos + 5);

  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Book a free 30-minute consultation to discuss your automation roadmap:', 20, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('📅 cal.com/iulian-boamfa-rjnurb/30min', 20, yPos);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AutoSys Lab | AI Employees & Workflow Automation for SMBs', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('autosyslab.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
};
