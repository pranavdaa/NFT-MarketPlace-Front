import { debounce } from '~/plugins/helpers/index'
import { createDecorator } from 'vue-class-component'

//
// Vue decorators
//
export function VueDebounce(duration) {
  return createDecorator((options, key) => {
    options.methods[key] = debounce(options.methods[key], duration)
  })
}

export function VueWatch(...paths) {
  if (paths.length <= 0) {
    throw new Error('Atleast one path required')
  }

  return createDecorator((componentOptions, key) => {
    const handler = componentOptions.methods[key]
    if (typeof componentOptions.watch !== 'object') {
      componentOptions.watch = Object.create(null)
    }

    // options
    let options = {}
    if (typeof paths[paths.length - 1] !== 'string') {
      options = paths.splice(-1, 1)[0]
    }

    // paths
    const { deep = false, immediate = false } = options
    paths.forEach((path) => {
      componentOptions.watch[path] = { handler, deep, immediate }
    })
  })
}

//
// End of vue decorators
//

export function Debounce(duration) {
  return function innerDecorator(target, key, descriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        // Attach this function to the instance (not the class)
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: debounce(descriptor.value, duration),
        })
        return this[key]
      },
    }
  }
}

export function sleepFor(timeInMilliSeconds = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeInMilliSeconds)
  })
}

export function waitFor(...names) {
  return (target, prop, descriptor) => {
    const fn = descriptor.value
    const newFn = function(...args) {
      const promises = names.map((name) => {
        if (!(this[name] instanceof Promise)) {
          throw new Error(`Expecting this['${name}'] to be a Promise`)
        }
        return this[name]
      })

      return Promise.all(promises).then(() => fn.apply(this, args))
    }
    descriptor.value = newFn
    return descriptor
  }
}

export function retry(retryInterval = 5000, n = 3) {
  return (target, prop, descriptor) => {
    const fn = descriptor.value
    let _retry = 0
    const newFn = async function(...args) {
      while (_retry === 0 || _retry < n) {
        try {
          return await fn.apply(this, args)
        } catch (e) {
          _retry++
          await sleepFor(retryInterval)
        }
      }
    }
    descriptor.value = newFn
    return descriptor
  }
}
