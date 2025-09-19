import AppLayout from '../components/Layout/AppLayout.jsx';
import GeneralReport from '../pages/Report/GeneralReport.jsx';
import ReportResumePanel from '../components/Report/ReportResumePanel.jsx';
import { createElement } from 'react';
import { REPORT_ROUTES } from './names';

export default [
  {
    path: REPORT_ROUTES.ROOT,
    element: createElement(AppLayout, {
      rightPanel: createElement(ReportResumePanel),
    }),
    children: [
        {
            path: REPORT_ROUTES.GENERAL,
            element: createElement(GeneralReport),
        },
    ]
  },
  
];
