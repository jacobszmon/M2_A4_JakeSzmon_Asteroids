class ParticleSystem extends GameObject {

    static EMITTER_MODE = Object.freeze({
            CONSTANT : 0,
            BURST : 1
        });

    constructor(manager, position, rotation, mode, rate, spread = 180) {
        super(manager, position, rotation, createVector(0, 0))

        // PARTICLE SETTINGS
        this.particles = [];
        this.avgParticleSpeed = 1.5;
        this.lifespan = 1;
        this.avgParticleSize = 5;
        
        // Disable collisions
        this.collisionEnabled = false;

        // EMISSION SETTINGS
        this.mode = mode; // BURST (Fire once, then die) or CONSTANT (Over time, locked to another object who can control it)
        this.rate = rate; // BURST: # of particles spawned. CONSTANT: Particle Spawned every X frames.
        this.angle = 0; // The angle the particles fire at. (Controlled by parent.)
        this.spread = spread; // The amount of spread the particles have from this.angle.
        this.running = false; // In CONSTANT mode, determines whether to emit particles.


        
        // In BURST mode, trigger the burst immediately.
        if (this.mode === ParticleSystem.EMITTER_MODE.BURST) {
            this.Burst();
        }
    }


    Update() {
        // Filter dead particles.
        this.particles = this.particles.filter(particle => particle.isAlive);

        // In BURST mode, if all particles have died, kill this particle system.
        if (this.mode === ParticleSystem.EMITTER_MODE.BURST && this.particles.length <= 0) {
            this.isAlive = false;
        }
        // In CONSTANT mode, run the Constant() emission method.
        else if (this.mode === ParticleSystem.EMITTER_MODE.CONSTANT) {
            this.Constant();
        }
        
        // Loop through all particles, moving them and incrementing their timers. If they get too old, kill them.
        this.particles.forEach(particle => {
            particle.position.add(particle.velocity);
            particle.timeAlive += deltaTime/1000;
            if (particle.timeAlive >= particle.maxLife) particle.isAlive = false;
        });
    }

    Draw() {
        this.particles.forEach(particle => {
            push();
                noFill();
                let fadeOut = 255 - (pow(particle.timeAlive / particle.maxLife, 2) * 255);
                stroke( 128, 128, 128, fadeOut );
                strokeWeight(2.5);
                translate(particle.position);
                circle(0, 0, particle.size);
            pop();
        });
        
    }


    // ------ EMISSION METHODS ------
    // Adds a number of particles equal to this.rate, which move in random directions.
    Burst() {
        for (let i = 0; i < this.rate; i++) {
            this.AddParticle(p5.Vector.random2D());
        }
    }
    // When running, adds a particle every this.rate frames. Each Particle fires at this.angle, and deviates by this.spread on either side.
    Constant() {
        if (!this.running)
            return

        if (frameCount % this.rate === 1) {
            let randAngle = this.angle  + random(-this.spread, this.spread);
            let vectDir = createVector(cos(randAngle), sin(randAngle));
            this.AddParticle(vectDir);
        }
    }
    // Adds a particle, which moves at a varying speed in the given (moveDir) direction.
    AddParticle(moveDir) {
        let vel = moveDir.mult(this.avgParticleSpeed + random(-1, 1));
        let size = this.avgParticleSize;
        let lifespan = this.lifespan;

        // Particles are simple javascript objects, because the particle system itself handles updating and drawing them.
        this.particles.push(
            {
                velocity: vel,
                position:  this.position.copy(),
                size: size,
                timeAlive: 0,
                maxLife: lifespan,
                isAlive: true,
            }
        );
    }
}