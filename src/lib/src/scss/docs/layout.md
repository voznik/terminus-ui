<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Layout](#layout)
  - [take-space](#take-space)
  - [center-content](#center-content)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Layout

A collection of mixins to assist with common layout needs.


### take-space

Used to force a child element to 'take up the space' within the parent. An optional offset can be
passed in.

```scss
.parent {
  // This must be added manually
  position: relative;

  .child {
    @include take-space;
  }
}

//// Compiles to: ////

.parent {
  position: relative;
}

.parent .child {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
```

When an offset is passed in, it will be used as the space between the parent's boundaries and the
child's boundaries.

```scss
// Don't do this in production code! Use the `spacing()` function!
$child-padding: 2em;

.parent {
  position: relative;

  .child {
    @include take-space(#{$child-padding});
  }
}

//// Compiles to: ////

.parent {
  position: relative;
}

.parent .child {
  bottom: 2em;
  left: 2em;
  position: absolute;
  right: 2em;
  top: 2em;
}
```

### center-content

Used to center a child within a parent element using flex-box styles.

```scss
.parent {
  .child {
    @include center-content;
  }
}

//// Compiles to: ////

.parent .child {
  align-items: center;
  display: flex;
  justify-content: center;
}
```
