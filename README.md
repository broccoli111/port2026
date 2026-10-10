# Ross Lauda Portfolio

Source for https://rosslauda.com, hosted on Namecheap shared hosting.

## Editing and deployment

Edit HTML, CSS, JavaScript, and assets here, then push to main. Namecheap checks GitHub every two minutes and deploys new commits automatically. Deployment copies root HTML/CSS/JS, .htaccess, and assets. Repository documentation, deployment scripts, and Git metadata stay outside the public site. SSL and hosting management files are preserved.

- Hosting checkout: /home/rossxzni/repositories/rosslauda-portfolio
- Website root: /home/rossxzni/public_html
- Installed runner: /home/rossxzni/portfolio-deploy/deploy.sh
- Deployment log: /home/rossxzni/portfolio-deploy/deploy.log
- Last deployed commit: /home/rossxzni/portfolio-deploy/deployed-commit

The installed runner is a copy of deployment/namecheap-deploy.sh. Updating its source requires installing the new copy on the host. It uses a lock to prevent concurrent deployments and stops if the checkout has uncommitted changes or cannot fast-forward. A failed deployment is retried on the next scheduled run.

The .cpanel.yml file also supports manual Deploy HEAD in cPanel Git Version Control.

## Recovery

The original full site backup is /home/rossxzni/portfolio-backups/public_html-before-git-20261010.tar.gz. For routine rollback, revert the unwanted commit on main and push the revert; the next check deploys it. Do not edit the hosted checkout directly while automatic deployment is enabled.

## Staging

Push experiments to staging to deploy https://staging.rosslauda.com. Merge approved staging work into main to deploy https://rosslauda.com. Each environment checks only its own branch every two minutes. Production deployment is unchanged. Staging is publicly accessible without a password at the owner's request.

| Item | Staging path |
| --- | --- |
| Checkout (tracks origin/staging) | /home/rossxzni/repositories/rosslauda-portfolio-staging |
| Confirmed document root | /home/rossxzni/staging.rosslauda.com |
| Installed runner | /home/rossxzni/portfolio-staging-deploy/deploy.sh |
| Lock | /home/rossxzni/portfolio-staging-deploy/deploy.lock |
| Last deployed commit | /home/rossxzni/portfolio-staging-deploy/deployed-commit |
| Log | /home/rossxzni/portfolio-staging-deploy/deploy.log |
| Original staging backup | /home/rossxzni/portfolio-backups/staging-before-git-20261010-0320.tar.gz |

Cron: */2 * * * * /bin/bash /home/rossxzni/portfolio-staging-deploy/deploy.sh >> /home/rossxzni/portfolio-staging-deploy/deploy.log 2>&1

The runner refuses any document root other than the confirmed staging directory, refuses symlink assets, requires a clean staging checkout, and uses a locked fast-forward pull. It copies assets and root HTML/CSS/JS only. Root directory permissions and ownership are preserved. Repository documentation, scripts, Git metadata, .well-known, and other hosting files are excluded. Staging .htaccess is host-managed (DirectoryIndex index.html and Options -Indexes) and is not replaced by production's .htaccess. Assets removed from Git are removed on staging; obsolete root HTML/CSS/JS files must be removed separately on the host.

The runner source is deployment/namecheap-staging-deploy.sh. Updating it requires installing the updated copy on the host; repository scripts are not automatically executed. The staging checkout is separate from cPanel's production Git repository. Do not use the inherited .cpanel.yml for staging: it is the production-only manual deployment recipe.

The environment banner is hostname-gated in site.js and appears only when the site is served from staging.rosslauda.com. Merging staging into main cannot display the banner on production.

For rollback, revert the unwanted commit on staging and push the revert. The next check deploys it. Do not edit the hosted checkout directly. The original password-gate index and authentication scripts remain backed up outside the web root in portfolio-staging-deploy/original-gate-index.html, original-auth.js, and original-gate.js; the full staging backup also preserves the original site.
