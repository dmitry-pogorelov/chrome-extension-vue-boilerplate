import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from 'firebase'
import Home from '@/scripts/components/Home.vue'
import Courses from '@/scripts/components/Courses.vue'
import Course from '@/scripts/components/Course.vue'
import Assignment from '@/scripts/components/Assignment/Assignment.vue'
import 'material-icons/iconfont/material-icons.css'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Courses',
      name: 'Courses',
      component: Courses
    },
    {
      path: '/Course/:id',
      name: 'Course',
      component: Course,
      props: true
    },
    {
      path: '/Assignment/:id',
      name: 'Assignment',
      component: Assignment,
      props: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (firebase.auth().currentUser) {
    next()
  }
})

export default router
