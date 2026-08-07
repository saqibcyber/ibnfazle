import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagsIcon} from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'Topic cluster heading. Defaults to the category title.',
    }),
    defineField({
      name: 'subheading',
      title: 'Page Subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Cluster Sections',
      type: 'array',
      description:
        'Customizable sections on this category page (e.g. Tahara, Salah), each with its own heading and linked content.',
      of: [defineArrayMember({type: 'clusterSection'})],
    }),
  ],
  orderings: [
    {
      name: 'title',
      title: 'Title',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      name: 'heading',
      title: 'Heading',
      by: [{field: 'heading', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
