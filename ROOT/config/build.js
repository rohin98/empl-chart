const baseDIR = './../dist/';

module.exports = {
    dest: {
        base: baseDIR,
        js: baseDIR + 'js',
        tpjs: baseDIR + 'tpjs',
        css: baseDIR + 'css',
        views: baseDIR,
    },
    sass: [
        // Common Styles
        './sass/common/common.scss',
        './sass/common/rightbar.scss',
        './sass/common/topbar.scss',
        './sass/common/notification.scss',
        './sass/common/generative-ai.scss',

        // Data Import
        './sass/data-import/data-import.scss',

        // Data Prep
        './sass/data-prep/codemirror-custom.scss',
        './sass/data-prep/data-prep.scss',
        './sass/data-prep/export.scss',
        './sass/data-prep/view-error-summary.scss',
        './sass/data-prep/grid-column-header.scss',
        './sass/data-prep/histogram.scss',

        // Homepage
        './sass/home/home.scss',

        // Operations History
        './sass/operations-history/operations-history.scss',

        // Project details
        './sass/project-details/project-details.scss',

        // Project Sync
        './sass/project-sync/project-sync.scss',

        // Settings
        './sass/settings/settings.scss',

        // Configuration sync
        './sass/configuration-sync/configuration-sync.scss',

        // Query tools
        './sass/query-tool/query-tool.scss',

        // Rules
        './sass/data-prep/rules.scss',

        // Portals
        './sass/portals/portals.scss',
        './sass/portals/user-profile.scss',
        './sass/portals/flags.scss',

        // Org Listing
        './sass/org-listing/org-listing.scss',

        // Admin Portal
        './sass/common/admin-portal.scss',

        // Integration
        './sass/integration/analytics.scss',
        './sass/integration/zohoone.scss',

        // Cluster management
        './sass/admin/cluster-management.scss',

        // Cluster management new
        './sass/admin/cluster-management-new.scss',

        // Entity Logs
        './sass/admin/entity-logs.scss',

        // White label
        './sass/client-portal/clientportal.scss',
        './sass/client-portal/signin.scss',
        './sass/client-portal/recoverypassword.scss',

        // Pipeline
        './sass/pipeline/pipeline-editor.scss',
        './sass/pipeline/jobs-summary.scss',
        './sass/pipeline/job-history.scss',
        './sass/pipeline/pipeline-template.scss'
    ],
    views: './html/**/*.html',
    modules: './modules/index.js',
    tpjs: './tpjs/**/*.js'
};