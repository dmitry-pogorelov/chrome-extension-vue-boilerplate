<template>
  <div>
    <v-layout row justify-space-between align-center>
      <div class="display-1">Courses</div>
      <v-dialog v-model="showNewCourseDialog" max-width="500px"  class="justify-end">
        <v-btn color="primary" dark slot="activator">New Course</v-btn>
        <v-form @submit.prevent="save">
          <v-card>
            <v-card-title>
              <span class="headline">New Course</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Course Name" ref="newCourseName" v-model="newCourse.name"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat type="submit">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-layout>
    <v-data-table ref="coursesTable" :items="courses" :headers="courseColumns" hide-actions>
      <template slot="items" slot-scope="props">
        <tr class="sortableRow" :key="props.item.id" @dblclick="$router.push({name: 'Course', params: {id: props.item.id}})">
          <td class="px-1" style="width: 0.1%">
            <v-btn style="cursor: move" icon class="sortHandle"><v-icon>drag_handle</v-icon></v-btn>
          </td>
          <td>
            <v-edit-dialog :return-value.sync="props.item.name" lazy >
              {{ props.item.name }}
              <v-text-field
                slot="input"
                label="Edit"
                v-model="props.item.name"
                single-line
                autofocus
                @keydown.native.enter="updateCourse(props.item)"
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="deleteCourse(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import db from '../services/data'
import Sortable from 'sortablejs'
export default {
  name: 'Courses',
  mounted () {
    var self = this
    /* eslint-disable no-new */
    new Sortable(
      self.$refs.coursesTable.$el.getElementsByTagName('tbody')[0],
      {
        draggable: '.sortableRow',
        handle: '.sortHandle',
        onEnd: self.moveCourse
      }
    )
  },
  data () {
    var self = this
    var vm = {
      showNewCourseDialog: false,
      courses: [],
      courseColumns: [
        { text: '', value: '', sortable: false },
        { text: 'Course', value: 'Course', sortable: false },
        { text: 'Actions', value: 'actions', align: 'right', sortable: false, width: 50 }
      ],
      emptyCourse: { name: '' },
      newCourse: {},
      save () {
        self.courses.push(self.newCourse)
        db.Courses.add(self.newCourse)
        self.showNewCourseDialog = false
      },
      close () {
        self.showNewCourseDialog = false
      },
      deleteCourse (course) {
        const index = self.courses.indexOf(course)
        if (confirm('Are you sure you want to delete this course?')) {
          self.courses.splice(index, 1)
          db.Courses.remove(course)
        }
      },
      updateCourse (course) {
        db.Courses.update(course)
      },
      moveCourse ({oldIndex, newIndex}) {
        db.Courses.reorder(self.courses, oldIndex, newIndex).then((orderedCourses) => {
          self.courses = orderedCourses
        })
      }
    }

    db.Courses.getAll().then((courses) => {
      courses.sort((course1, course2) => {
        return course1.order - course2.order
      })
      vm.courses = courses
    })
    return vm
  },
  watch: {
    showNewCourseDialog (val) {
      if (val) {
        this.newCourse = Object.assign({}, this.emptyCourse)
        this.$nextTick(this.$refs.newCourseName.focus)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
