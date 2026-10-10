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
