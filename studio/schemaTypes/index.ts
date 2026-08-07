import {article} from './documents/article'
import {category} from './documents/category'
import {pdf} from './documents/pdf'
import {siteSettings} from './documents/site-settings'
import {tag} from './documents/tag'
import {clusterSection} from './objects/cluster-section'
import {socialLink} from './objects/social-link'

export const schemaTypes = [
  // Documents
  article,
  pdf,
  category,
  tag,
  siteSettings,
  // Objects
  clusterSection,
  socialLink,
]
