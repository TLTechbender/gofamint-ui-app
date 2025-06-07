import aboutPage from './documents/aboutPage'
import {comment} from './documents/blogComments'
import {blogPost} from './documents/blogs'
import eventRegistration from './documents/eventRegistration'
import events from './documents/events'

import gallery from './documents/gallery'
import homePage from './documents/homePage'
import sermonsPage from './documents/sermonsPage'
import {user} from './documents/user'

export const schemaTypes = [
  homePage,
  aboutPage,
  sermonsPage,
  gallery,

  user,
  eventRegistration,
  events,
  blogPost,
  comment,
]
