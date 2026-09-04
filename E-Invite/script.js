document.addEventListener("DOMContentLoaded", () => {

    const envelope = document.querySelector(".envelope");
    const waxSeal = document.querySelector(".wax-seal");
    const envelopeFlap = document.querySelector(".envelope-flap");
    const invitationCard = document.querySelector(".invitation-card");
    const scene = document.querySelector(".scene");
    if (
        !envelope ||
        !waxSeal ||
        !envelopeFlap ||
        !invitationCard
    ) {
        console.error("Wedding invitation elements could not be found.");
        return;
    }


    // Prevent the animation from running more than once.
    let invitationOpened = false;


    // Accessibility:
    // Detect whether the visitor prefers reduced motion.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /*
    =========================================================
    CONFIGURATION

    These values control the cinematic timing.
    You can change them later without rewriting the animation.
    =========================================================
    */

    const animationSettings = {

        sealDuration: 500,

        flapDuration: 1000,

        firstCardRiseDuration: 900,

        finalCardRiseDuration: 650,

        pauseAfterSeal: 100,

        pauseAfterFlap: 150,

        // Final resting position of the invitation.
        cardFinalPosition: "-64%"
    };


    /*
    =========================================================
    SMALL DELAY HELPER
    =========================================================
    */

    function wait(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }


    /*
    =========================================================
    OPEN INVITATION
    =========================================================
    */

    async function openInvitation() {

        if (invitationOpened) {
            return;
        }

        invitationOpened = true;

        envelope.classList.add("is-opening");

        waxSeal.disabled = true;

        waxSeal.setAttribute("aria-expanded", "true");


        /*
        =====================================================
        REDUCED MOTION VERSION
        =====================================================
        */

        if (prefersReducedMotion) {

            waxSeal.style.display = "none";

            envelopeFlap.style.transform = "rotateX(-180deg)";
            envelopeFlap.style.zIndex = "0";

            invitationCard.style.opacity = "1";
            invitationCard.style.transform =
                `translateY(${animationSettings.cardFinalPosition})`;

            invitationCard.style.zIndex = "8";
            invitationCard.style.pointerEvents = "auto";

            envelope.classList.remove("is-opening");
            envelope.classList.add("is-open");

            return;
        }


        /*
        =====================================================
        STEP 1
        WAX SEAL REACTION
        =====================================================
        */

        await animateWaxSeal();


        /*
        =====================================================
        STEP 2
        OPEN ENVELOPE FLAP
        =====================================================
        */

        await wait(
            animationSettings.pauseAfterSeal
        );

        await openEnvelopeFlap();


        /*
        =====================================================
        STEP 3
        INVITATION BEGINS TO RISE
        =====================================================
        */

        await wait(
            animationSettings.pauseAfterFlap
        );

        await revealInvitation();


        /*
        =====================================================
        STEP 4
        FINISH
        =====================================================
        */

        invitationCard.style.pointerEvents = "auto";

        envelope.classList.remove("is-opening");

        envelope.classList.add("is-open");
    }


    /*
    =========================================================
    WAX SEAL ANIMATION
    =========================================================
    */

    async function animateWaxSeal() {

        const animation = waxSeal.animate(

            [
                {
                    transform:
                        "translate(-50%, -50%) scale(1) rotate(0deg)",

                    opacity: 1
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(0.94) rotate(-4deg)",

                    opacity: 1,

                    offset: 0.25
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1.08) rotate(5deg)",

                    opacity: 1,

                    offset: 0.55
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(0.7) rotate(-10deg)",

                    opacity: 0
                }
            ],

            {
                duration:
                    animationSettings.sealDuration,

                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",

                fill:
                    "forwards"
            }
        );


        await animation.finished;


        waxSeal.style.opacity = "0";

        waxSeal.style.display = "none";
    }


    /*
    =========================================================
    ENVELOPE FLAP ANIMATION
    =========================================================
    */

    async function openEnvelopeFlap() {

        /*
        Keep the flap above everything while it begins opening.
        */

        envelopeFlap.style.zIndex = "7";


        const animation = envelopeFlap.animate(

            [
                {
                    transform:
                        "rotateX(0deg)"
                },

                {
                    transform:
                        "rotateX(-25deg)",

                    offset: 0.18
                },

                {
                    transform:
                        "rotateX(-105deg)",

                    offset: 0.60
                },

                {
                    transform:
                        "rotateX(-180deg)"
                }
            ],

            {
                duration:
                    animationSettings.flapDuration,

                easing:
                    "cubic-bezier(0.65, 0, 0.35, 1)",

                fill:
                    "forwards"
            }
        );


        await animation.finished;


        /*
        Permanently leave flap open.
        */

        envelopeFlap.style.transform =
            "rotateX(-180deg)";


        /*
        Move the flap behind the invitation after opening.
        */

        envelopeFlap.style.zIndex = "0";
    }


    /*
    =========================================================
    INVITATION CARD ANIMATION
    =========================================================
    */

    async function revealInvitation() {

        invitationCard.style.pointerEvents = "none";

        /*
        =====================================================
        STEP 1 — CARD RISES OUT OF THE ENVELOPE
        =====================================================
        */

        invitationCard.style.zIndex = "2";
        scene.classList.add("invite-focus");

        const riseAnimation = invitationCard.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(25%)"
                },
                {
                    opacity: 1,
                    transform: "translateY(-55%)"
                }
            ],
            {
                duration: 1100,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards"
            }
        );

        await riseAnimation.finished;


        /*
        Card has now visually cleared the envelope.
        Bring it above the envelope layers.
        */

        invitationCard.style.opacity = "1";
        invitationCard.style.transform = "translateY(-55%)";

        invitationCard.style.zIndex = "8";


        /*
        Small cinematic pause.
        */

        await wait(180);


        /*
        =====================================================
        STEP 2 — CALCULATE CENTER OF SCREEN
        =====================================================
        */

        const cardRect =
            invitationCard.getBoundingClientRect();

        const viewportHeight =
            window.visualViewport?.height ||
            window.innerHeight;

        const viewportCenter =
            viewportHeight / 2;

        const cardCenter =
            cardRect.top +
            cardRect.height / 2;

        /*
        Determine how far DOWN or UP we need to move
        from the card's CURRENT position.
        */

        const movementToCenter =
            viewportCenter - cardCenter;


        /*
        =====================================================
        STEP 3 — CARD FLOATS DOWN INTO CENTER
        =====================================================
        */

        const centerAnimation =
            invitationCard.animate(
                [
                    {
                        transform: "translateY(-55%)"
                    },

                    {
                        transform:
                            `translateY(calc(-55% + ${movementToCenter}px))`
                    }
                ],
                {
                    duration: 900,

                    easing:
                        "cubic-bezier(0.16, 1, 0.3, 1)",

                    fill: "forwards"
                }
            );


        await centerAnimation.finished;


        /*
        Final permanent position.
        */

        invitationCard.style.transform =
            `translateY(calc(-55% + ${movementToCenter}px))`;

        invitationCard.style.pointerEvents = "auto";
    }


    /*
    =========================================================
    CLICK EVENT
    =========================================================
    */

    waxSeal.addEventListener(
        "click",
        openInvitation
    );

});