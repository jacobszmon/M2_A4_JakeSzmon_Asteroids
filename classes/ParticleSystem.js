class ParticleSystem extends GameObject {

    static EMITTER_MODE = Object.freeze({
            CONSTANT : 0,
            BURST : 1
        });

    constructor(manager, position, rotation, mode, rate, spread = 180) {
        super(manager, position, rotation, createVector(0, 0))

        this.avgParticleSpeed = 1.5;
        this.lifespan = 1;
        this.avgParticleSize = 5;
        
        this.collisionEnabled = false;

        this.timeActive = 0;

        this.mode = mode;

        this.rate = rate; // BURST: # of particles spawned. CONSTANT: Particle Spawned every X frames.

        this.particles = [];

        this.angle = 0;
        this.spread = spread;

        this.running = false;

        if (this.mode === ParticleSystem.EMITTER_MODE.BURST) {
            this.Burst();
        }
    }

    Burst() {
        for (let i = 0; i < this.rate; i++) {
            this.AddParticle(p5.Vector.random2D());
        }
    }

    Constant() {
        if (!this.running)
            return

        if (frameCount % this.rate === 1) {
            let randAngle = this.angle  + random(-this.spread, this.spread);
            let vectDir = createVector(cos(randAngle), sin(randAngle));
            this.AddParticle(vectDir);
        }
    }


    AddParticle(moveDir) {
        let vel = moveDir.mult(this.avgParticleSpeed + random(-1, 1));
        let size = this.avgParticleSize;
        let lifespan = this.lifespan;

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

    Update() {
        this.particles = this.particles.filter(particle => particle.isAlive);


        if (this.mode === ParticleSystem.EMITTER_MODE.BURST && this.particles.length <= 0) {
            this.isAlive = false;
        }
        else if (this.mode === ParticleSystem.EMITTER_MODE.CONSTANT) {
            this.Constant();
        }
        

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
}