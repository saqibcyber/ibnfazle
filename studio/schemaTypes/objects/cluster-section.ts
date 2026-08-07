import {defineArrayMember, defineField, defineType} from 'sanity'

export const clusterSection = defineType({
  name: 'clusterSection',
  title: 'Cluster Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Linked Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'article'}, {type: 'pdf'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      items: 'items',
    },
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Untitled section',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      }
    },
  },
})
