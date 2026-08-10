import FluidGlassOfficial from './react-bits/FluidGlass.official';

export default function FluidGlass({ className = '', mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }) {

  return (
    <div className={`fluid-glass-official ${className}`}>
      <FluidGlassOfficial
        mode={mode}
        barProps={barProps}
        lensProps={lensProps}
        cubeProps={cubeProps}
      />
    </div>
  );
}
